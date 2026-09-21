// Mock data for the concept demo.
// In a real version, STORES stays similar, but PRODUCTS and PROMOS would come
// from a backend aggregating retailers' promo catalogs (see README).

const STORES = [
  { id: "carrefour", name: "Carrefour" },
  { id: "leclerc", name: "E.Leclerc" },
  { id: "auchan", name: "Auchan" },
  { id: "lidl", name: "Lidl" },
  { id: "intermarche", name: "Intermarché" },
  { id: "superu", name: "Super U" },
  { id: "casino", name: "Casino" },
  { id: "monoprix", name: "Monoprix" },
  { id: "aldi", name: "Aldi" },
  { id: "cora", name: "Cora" },
];

const PRODUCTS = [
  { id: "lait", name: "Lait" },
  { id: "cafe", name: "Café" },
  { id: "pates", name: "Pâtes / Riz" },
  { id: "couches", name: "Couches" },
  { id: "hygiene", name: "Hygiène" },
  { id: "menager", name: "Produits ménagers" },
  { id: "fruits-legumes", name: "Fruits & légumes" },
  { id: "viande", name: "Viande" },
  { id: "poisson", name: "Poisson" },
  { id: "surgeles", name: "Surgelés" },
  { id: "petit-dejeuner", name: "Petit-déjeuner" },
  { id: "boissons", name: "Boissons" },
];

// id of product/category -> null for custom (free text) entries added by the user
const PROMOS = [
  { id: "p1", storeId: "carrefour", productId: "lait", title: "Lait demi-écrémé 1L, lot de 6", oldPrice: 7.2, newPrice: 4.99, validUntil: "2026-09-28" },
  { id: "p2", storeId: "lidl", productId: "cafe", title: "Café moulu 250g", oldPrice: 3.5, newPrice: 2.1, validUntil: "2026-09-30" },
  { id: "p3", storeId: "leclerc", productId: "couches", title: "Couches taille 4, paquet géant", oldPrice: 14.9, newPrice: 9.9, validUntil: "2026-09-27" },
  { id: "p4", storeId: "auchan", productId: "pates", title: "Pâtes penne 1kg, lot de 3", oldPrice: 4.5, newPrice: 2.7, validUntil: "2026-10-02" },
  { id: "p5", storeId: "intermarche", productId: "menager", title: "Lessive liquide 3L", oldPrice: 11.0, newPrice: 6.5, validUntil: "2026-09-29" },
  { id: "p6", storeId: "superu", productId: "fruits-legumes", title: "Pommes Golden 1kg", oldPrice: 2.8, newPrice: 1.5, validUntil: "2026-09-25" },
  { id: "p7", storeId: "casino", productId: "hygiene", title: "Gel douche, lot de 2", oldPrice: 6.0, newPrice: 3.6, validUntil: "2026-10-01" },
  { id: "p8", storeId: "monoprix", productId: "surgeles", title: "Légumes surgelés 1kg", oldPrice: 3.2, newPrice: 1.9, validUntil: "2026-09-26" },
  { id: "p9", storeId: "aldi", productId: "boissons", title: "Jus d'orange 1L, lot de 4", oldPrice: 5.6, newPrice: 3.4, validUntil: "2026-09-30" },
  { id: "p10", storeId: "cora", productId: "petit-dejeuner", title: "Céréales chocolat 500g", oldPrice: 4.3, newPrice: 2.5, validUntil: "2026-09-28" },
  { id: "p11", storeId: "carrefour", productId: "viande", title: "Poulet fermier au kilo", oldPrice: 12.5, newPrice: 8.9, validUntil: "2026-09-27" },
  { id: "p12", storeId: "lidl", productId: "poisson", title: "Filets de saumon 300g", oldPrice: 6.9, newPrice: 4.5, validUntil: "2026-09-29" },
  { id: "p13", storeId: "leclerc", productId: "lait", title: "Lait infantile 2ème âge", oldPrice: 16.0, newPrice: 11.9, validUntil: "2026-10-03" },
  { id: "p14", storeId: "auchan", productId: "cafe", title: "Capsules café compatibles x50", oldPrice: 12.0, newPrice: 7.5, validUntil: "2026-09-30" },
];

// Title templates used by the "simulate new promo" demo button, combined at
// runtime with one of the user's own selected stores/products so the demo
// always produces a promo that actually matches their criteria.
const SIMULATED_TITLE_TEMPLATES = [
  "Offre spéciale : {product}",
  "Prix cassé sur {product}",
  "{product} en promotion cette semaine",
  "Bon plan : {product}",
];
