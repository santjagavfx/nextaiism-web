# nextaiism-web
NextAIism — Website &amp; Living AI Laboratory

## Local development

Use Node.js 20.9 or newer and npm.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000. On macOS and Linux, use `npm` instead of `npm.cmd`.

Open `/logo-preview` to compare and download the SVG logo concepts. The source assets are in `public/logos/`.
The site redirects unprefixed URLs to the saved language or to English on the first visit. Locale prefixes are `/en`, `/ru`, `/es`, `/de`, `/fr`, `/it`, `/pt-BR`, `/pl`, `/tr`, and `/id`. Set `NEXTAIISM_SITE_URL` to the public site origin when building for deployment so canonical and hreflang URLs point to that origin.

See [the publication workflow](content/publications/README.md) for authoring and reviewing translations.

## Checks and production

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```
