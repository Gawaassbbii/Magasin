(function () {
  "use strict";

  const STORAGE_KEY = "magasin.prefs.v1";

  /** @type {{selectedStores: string[], selectedProducts: string[], customProducts: {id:string,name:string}[], seenPromoIds: string[], notifsEnabled: boolean}} */
  let state = loadState();

  // Extra promos created at runtime by the "simulate" demo button.
  const runtimePromos = [];

  const els = {
    settingsBtn: document.getElementById("settings-btn"),
    stepStores: document.getElementById("step-stores"),
    storeList: document.getElementById("store-list"),
    toStepProducts: document.getElementById("to-step-products"),
    stepProducts: document.getElementById("step-products"),
    productList: document.getElementById("product-list"),
    customProductInput: document.getElementById("custom-product"),
    addCustomProduct: document.getElementById("add-custom-product"),
    backToStores: document.getElementById("back-to-stores"),
    toAlerts: document.getElementById("to-alerts"),
    stepAlerts: document.getElementById("step-alerts"),
    alertsList: document.getElementById("alerts-list"),
    noAlerts: document.getElementById("no-alerts"),
    markAllRead: document.getElementById("mark-all-read"),
    notifBanner: document.getElementById("notif-banner"),
    enableNotifs: document.getElementById("enable-notifs"),
    simulatePromo: document.getElementById("simulate-promo"),
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    } catch {
      return defaultState();
    }
  }

  function defaultState() {
    return {
      selectedStores: [],
      selectedProducts: [],
      customProducts: [],
      seenPromoIds: [],
      notifsEnabled: false,
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode, quota) — app still works this session
    }
  }

  function allPromos() {
    return PROMOS.concat(runtimePromos);
  }

  // --- Step: stores ---
  function renderStoreList() {
    els.storeList.innerHTML = "";
    STORES.forEach((store) => {
      const selected = state.selectedStores.includes(store.id);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = store.name;
      chip.setAttribute("aria-pressed", String(selected));
      chip.addEventListener("click", () => {
        toggleInArray(state.selectedStores, store.id);
        saveState();
        renderStoreList();
        updateContinueButton();
      });
      els.storeList.appendChild(chip);
    });
  }

  function updateContinueButton() {
    els.toStepProducts.disabled = state.selectedStores.length === 0;
  }

  // --- Step: products ---
  function renderProductList() {
    els.productList.innerHTML = "";
    PRODUCTS.forEach((product) => {
      els.productList.appendChild(makeProductChip(product.id, product.name));
    });
    state.customProducts.forEach((product) => {
      els.productList.appendChild(makeProductChip(product.id, product.name, true));
    });
    updateAlertsButton();
  }

  function makeProductChip(id, label, removable) {
    const selected = state.selectedProducts.includes(id);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = removable ? `${label} ✕` : label;
    chip.setAttribute("aria-pressed", String(selected));
    chip.addEventListener("click", () => {
      if (removable && selected) {
        // clicking an already-selected custom chip removes it entirely
        state.customProducts = state.customProducts.filter((p) => p.id !== id);
        state.selectedProducts = state.selectedProducts.filter((p) => p !== id);
      } else {
        toggleInArray(state.selectedProducts, id);
      }
      saveState();
      renderProductList();
    });
    return chip;
  }

  function updateAlertsButton() {
    els.toAlerts.disabled = state.selectedProducts.length === 0;
  }

  function addCustomProduct() {
    const raw = els.customProductInput.value.trim();
    if (!raw) return;
    const id = "custom-" + raw.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!state.customProducts.some((p) => p.id === id)) {
      state.customProducts.push({ id, name: raw });
    }
    if (!state.selectedProducts.includes(id)) {
      state.selectedProducts.push(id);
    }
    els.customProductInput.value = "";
    saveState();
    renderProductList();
  }

  // --- Step: alerts ---
  function matchesCustomProduct(promo) {
    return state.customProducts.some(
      (p) => state.selectedProducts.includes(p.id) && promo.title.toLowerCase().includes(p.name.toLowerCase())
    );
  }

  function visiblePromos() {
    return allPromos()
      .filter((promo) => state.selectedStores.includes(promo.storeId))
      .filter((promo) => state.selectedProducts.includes(promo.productId) || matchesCustomProduct(promo))
      .sort((a, b) => discountPct(b) - discountPct(a));
  }

  function discountPct(promo) {
    return Math.round((1 - promo.newPrice / promo.oldPrice) * 100);
  }

  function storeName(id) {
    return STORES.find((s) => s.id === id)?.name ?? id;
  }

  function renderAlerts() {
    const promos = visiblePromos();
    els.alertsList.innerHTML = "";
    els.noAlerts.hidden = promos.length > 0;

    promos.forEach((promo) => {
      const unread = !state.seenPromoIds.includes(promo.id);
      const li = document.createElement("li");
      li.className = "alert-card" + (unread ? " unread" : "");

      const validUntil = promo.validUntil
        ? new Date(promo.validUntil).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
        : null;

      li.innerHTML = `
        <div class="alert-top">
          <span class="alert-store">${storeName(promo.storeId)}${unread ? '<span class="badge-new">Nouveau</span>' : ""}</span>
          <span class="discount-pct">-${discountPct(promo)}%</span>
        </div>
        <p class="alert-title">${escapeHtml(promo.title)}</p>
        <div class="alert-prices">
          <span class="price-old">${promo.oldPrice.toFixed(2)} €</span>
          <span class="price-new">${promo.newPrice.toFixed(2)} €</span>
        </div>
        ${validUntil ? `<p class="alert-meta">Valable jusqu'au ${validUntil}</p>` : ""}
      `;
      els.alertsList.appendChild(li);
    });
  }

  function markAllRead() {
    const ids = visiblePromos().map((p) => p.id);
    state.seenPromoIds = Array.from(new Set(state.seenPromoIds.concat(ids)));
    saveState();
    renderAlerts();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function toggleInArray(arr, value) {
    const i = arr.indexOf(value);
    if (i === -1) arr.push(value);
    else arr.splice(i, 1);
  }

  // --- Notifications (demo) ---
  function updateNotifBanner() {
    const supported = "Notification" in window;
    els.notifBanner.hidden = !supported || state.notifsEnabled || Notification.permission === "denied";
  }

  function enableNotifications() {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then((perm) => {
      state.notifsEnabled = perm === "granted";
      saveState();
      updateNotifBanner();
    });
  }

  function notifyNewPromo(promo) {
    if (!state.notifsEnabled || !("Notification" in window)) return;
    try {
      new Notification("Nouvelle promo chez " + storeName(promo.storeId), {
        body: `${promo.title} — ${promo.newPrice.toFixed(2)} € (-${discountPct(promo)}%)`,
      });
    } catch {
      // some browsers restrict Notification outside a service worker context
    }
  }

  function productLabel(id) {
    return (
      PRODUCTS.find((p) => p.id === id)?.name ??
      state.customProducts.find((p) => p.id === id)?.name ??
      id
    );
  }

  function simulatePromo() {
    if (!state.selectedStores.length || !state.selectedProducts.length) return;
    const storeId = state.selectedStores[Math.floor(Math.random() * state.selectedStores.length)];
    const productId = state.selectedProducts[Math.floor(Math.random() * state.selectedProducts.length)];
    const template = SIMULATED_TITLE_TEMPLATES[Math.floor(Math.random() * SIMULATED_TITLE_TEMPLATES.length)];
    const oldPrice = Math.round((Math.random() * 8 + 2) * 100) / 100;
    const newPrice = Math.round(oldPrice * (1 - (0.3 + Math.random() * 0.4)) * 100) / 100;
    const promo = {
      id: "sim-" + Date.now(),
      storeId,
      productId,
      title: template.replace("{product}", productLabel(productId)),
      oldPrice,
      newPrice,
      validUntil: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
    };
    runtimePromos.unshift(promo);
    renderAlerts();
    notifyNewPromo(promo);
  }

  // --- Navigation ---
  function showStep(name) {
    els.stepStores.hidden = name !== "stores";
    els.stepProducts.hidden = name !== "products";
    els.stepAlerts.hidden = name !== "alerts";
    els.settingsBtn.hidden = name === "stores" && state.selectedStores.length === 0 && state.selectedProducts.length === 0;
    if (name === "alerts") {
      renderAlerts();
      updateNotifBanner();
    }
  }

  els.toStepProducts.addEventListener("click", () => showStep("products"));
  els.backToStores.addEventListener("click", () => showStep("stores"));
  els.toAlerts.addEventListener("click", () => showStep("alerts"));
  els.settingsBtn.addEventListener("click", () => showStep("stores"));
  els.markAllRead.addEventListener("click", markAllRead);
  els.enableNotifs.addEventListener("click", enableNotifications);
  els.simulatePromo.addEventListener("click", simulatePromo);
  els.addCustomProduct.addEventListener("click", addCustomProduct);
  els.customProductInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomProduct();
    }
  });

  // --- Init ---
  renderStoreList();
  renderProductList();
  updateContinueButton();
  updateAlertsButton();

  if (state.selectedStores.length > 0 && state.selectedProducts.length > 0) {
    showStep("alerts");
  } else if (state.selectedStores.length > 0) {
    showStep("products");
  } else {
    showStep("stores");
  }
})();
