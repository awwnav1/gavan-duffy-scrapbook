# Patrick Gavan Duffy — Scrapbook Site

A self-contained Vite + React site for the Patrick Gavan Duffy scrapbook artifact.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

The output goes to `dist/`.

## File map

```
site/
  index.html              page shell
  package.json            dependencies
  vite.config.js          build config
  src/
    main.jsx              React mounting point
    GavanDuffyScrapbook.jsx   the scrapbook component
```

The Vercel and Netlify deployment guides assume this layout.
