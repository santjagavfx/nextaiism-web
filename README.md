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

## Checks and production

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run start
```
