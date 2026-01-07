# Configuration Tailwind CSS

Ce projet utilise maintenant Tailwind CSS au lieu de SCSS.

## Installation

Les dépendances sont déjà installées via npm :
- tailwindcss
- postcss
- autoprefixer

## Compilation du CSS

Pour compiler le CSS Tailwind, utilisez :

```bash
npm run build:css
```

Pour surveiller les changements et recompiler automatiquement :

```bash
npm run watch:css
```

Le fichier CSS compilé sera généré dans `assets/css/styles.css`.

## Configuration

- **tailwind.config.js** : Configuration Tailwind avec les couleurs personnalisées et breakpoints
- **postcss.config.js** : Configuration PostCSS
- **assets/styles/app.css** : Fichier source avec les directives Tailwind

## Couleurs personnalisées

Les couleurs du projet sont définies dans `tailwind.config.js` :
- `nav-bg`: #2E2D3F
- `nav-hover`: #007bff
- `nav-border`: #e0e0e0
- `footer-bg`: #2c3e50
- `footer-text`: #ecf0f1
- `footer-link`: #bdc3c7
- `footer-link-hover`: #3498db
- `footer-heading`: #ffffff
- `footer-border`: #34495e

## Breakpoints

- `xs`: 480px
- `sm`: 768px
- `md`: 992px
- `lg`: 1200px
- `xl`: 1400px

## Notes

Avec Symfony AssetMapper, le fichier `assets/styles/app.css` est importé dans `assets/app.js`. 
Pour que Tailwind fonctionne, vous devez compiler le CSS avec la commande `npm run build:css` 
et mettre à jour le template pour pointer vers le fichier compilé, ou configurer PostCSS 
pour traiter automatiquement les fichiers CSS.

