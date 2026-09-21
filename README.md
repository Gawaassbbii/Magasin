# Magasin — alertes promos personnalisées

## Le besoin de départ

En réaction à un reportage sur les chasseurs de bons plans, un commentaire
disait en substance : *"je n'ai pas l'énergie de traquer les promos moi-même
(je suis en AAH). Ce qui m'aiderait, c'est une appli où je choisis mes
magasins et les produits qui m'intéressent, et qui me prévient elle-même."*

Réponse courte : **oui, c'est possible**, et ce dépôt contient un premier
concept fonctionnel qui montre à quoi ça ressemblerait.

## Ce que contient ce concept

Une petite application web (`index.html` + `css/` + `js/`), sans backend ni
dépendance, pensée pour demander le moins d'efforts possible :

1. **Choix des magasins** — on coche les enseignes que l'on fréquente.
2. **Choix des produits** — catégories courantes (lait, couches, hygiène,
   surgelés...) ou un produit précis tapé à la main.
3. **Tableau des alertes** — la liste des promos qui correspondent à la fois
   au magasin *et* au produit sélectionnés, triées par pourcentage de
   réduction, avec un badge "Nouveau" tant qu'on ne les a pas vues.

Les préférences sont mémorisées (`localStorage`) : on ne les ressaisit
jamais. Un bouton "Simuler une nouvelle promo" sert uniquement à la démo,
pour montrer l'effet d'une alerte qui arrive.

### Essayer en local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

Aucune installation, aucune compilation.

### Choix d'accessibilité

Pensé pour quelqu'un qui a peu d'énergie disponible :
- gros boutons cliquables (44px minimum), peu d'étapes, tout est mémorisé ;
- pas d'obligation de revenir chaque jour : les alertes s'accumulent et
  attendent d'être consultées ;
- focus clairement visible au clavier, contrastes suffisants, respect de
  `prefers-reduced-motion` ;
- aucune création de compte, aucune donnée envoyée à un serveur.

## Ce qu'il manque pour une vraie version (les promos réelles)

La partie la plus dure n'est pas l'interface ci-dessus : c'est la **source
des promos**. Ce concept utilise des données fictives (`js/data.js`). Pour
une version réelle, plusieurs pistes, du plus simple au plus solide :

1. **Agréger des flux existants.** Des services comme Bonial, Shopmium ou
   les catalogues PDF publiés par les enseignes exposent déjà une partie de
   ces informations. Un petit service backend irait chercher/rafraîchir ces
   catalogues régulièrement et les transformerait en un format simple
   (magasin, catégorie, produit, prix, date de validité).
2. **Partenariats enseignes.** Certaines enseignes ont des API partenaires
   (souvent réservées aux professionnels). Cela demande des démarches mais
   donne les données les plus fiables.
3. **Contribution communautaire.** Un mode où les utilisateurs signalent une
   promo vue en magasin (avec modération) peut démarrer sans aucune donnée
   externe, à la manière d'une appli comme "Too Good To Go" à ses débuts.

Ces trois pistes peuvent se combiner. Le front-end de ce dépôt n'aurait pas
à changer : il suffirait de remplacer `js/data.js` par un appel à une vraie
API.

## Prochaines étapes suggérées

- Brancher une vraie source de données (même restreinte à quelques enseignes
  au départ) à la place de `js/data.js`.
- Notifications push réelles (hors onglet ouvert) via un service worker et
  un petit backend d'envoi, en s'appuyant sur l'API `Notification` déjà
  câblée ici comme point de départ.
- Empaqueter en PWA installable (icône sur l'écran d'accueil) pour que ça
  ressemble à une vraie appli sans passer par un store.
