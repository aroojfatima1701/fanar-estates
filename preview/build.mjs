// Builds a static, multi-page preview of the site from the React components:
// each page is rendered to HTML on the server (so it is complete before JavaScript loads)
// and then hydrated in the browser. Run: node preview/build.mjs
// In the Next.js project these same views become app/<route>/page.tsx files.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist');
const tmp = path.join(os.tmpdir(), 'fanar-preview-tmp');
const globalModules = execSync('npm root -g').toString().trim();
// Uses the project's own esbuild (npm install) when present, else a shared copy.
let build;
try { ({ build } = await import('esbuild')); } catch { ({ build } = await import('/opt/npm-tools/node_modules/esbuild/lib/main.js')); }
const localModules = path.join(root, 'node_modules');
const reactHome = fs.existsSync(path.join(localModules, 'react')) ? localModules : globalModules;

const dataSrc = fs.readFileSync(path.join(root, 'src/lib/data.ts'), 'utf8');
const propSrc = dataSrc.slice(dataSrc.indexOf('export const properties'), dataSrc.indexOf('export const communityPins'));
function grab(name) {
  const start = dataSrc.indexOf(`export const ${name}`);
  const block = dataSrc.slice(start, dataSrc.indexOf('];', start));
  return [...block.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
}
const listings = [...propSrc.matchAll(/slug: '([^']+)', title: '([^']+)'/g)].map((m) => ({ slug: m[1], title: m[2] }));

const pages = [
  { name: 'index', view: 'Home', title: 'Fanar Estates · Luxury real estate in Dubai' },
  { name: 'buy', view: 'Search', title: 'Properties for sale in Dubai · Fanar Estates', props: { purpose: 'buy' } },
  { name: 'rent', view: 'Search', title: 'Properties for rent in Dubai · Fanar Estates', props: { purpose: 'rent' } },
  ...listings.map((l) => ({ name: `property-${l.slug}`, view: 'Property', title: `${l.title} · Fanar Estates`, props: { slug: l.slug } })),
  { name: 'off-plan', view: 'OffPlan', title: 'Off-plan projects in Dubai · Fanar Estates' },
  ...grab('projects').map((s) => ({ name: `off-plan-${s}`, view: 'Project', title: 'Off-plan project · Fanar Estates', props: { slug: s } })),
  { name: 'communities', view: 'Communities', title: 'Dubai communities · Fanar Estates' },
  ...grab('communities').map((s) => ({ name: `communities-${s}`, view: 'Community', title: 'Community guide · Fanar Estates', props: { slug: s } })),
  { name: 'sell', view: 'Sell', title: 'Sell your property · Fanar Estates' },
  { name: 'team', view: 'Team', title: 'Our team · Fanar Estates' },
  ...['a1', 'a2', 'a3', 'a4'].map((id) => ({ name: `team-${id}`, view: 'Agent', title: 'Adviser · Fanar Estates', props: { id } })),
  { name: 'insights', view: 'Insights', title: 'Insights · Fanar Estates' },
  ...grab('articles').map((s) => ({ name: `insights-${s}`, view: 'Article', title: 'Insights · Fanar Estates', props: { slug: s } })),
  { name: 'about', view: 'About', title: 'About Fanar Estates' },
  { name: 'contact', view: 'Contact', title: 'Contact · Fanar Estates' },
  { name: 'services-golden-visa', view: 'Service', title: 'Golden Visa through property · Fanar Estates', props: { slug: 'golden-visa' } },
  { name: 'services-management', view: 'Service', title: 'Property management · Fanar Estates', props: { slug: 'management' } },
  { name: 'admin', view: 'Admin', title: 'Fanar Admin' },
];
const soonTitles = {
  buy: 'Properties for sale', rent: 'Properties for rent', 'off-plan': 'Off-plan projects', communities: 'Communities',
  sell: 'Sell your property', about: 'About Fanar', team: 'Our team', insights: 'Insights', contact: 'Contact',
};

fs.rmSync(out, { recursive: true, force: true });
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(tmp, { recursive: true });

const common = {
  bundle: true, jsx: 'automatic', nodePaths: [localModules, globalModules], logLevel: 'error',
  define: { 'process.env.NODE_ENV': '"production"' }, loader: { '.tsx': 'tsx', '.ts': 'ts' },
};

globalThis.__MEDIA_BASE__ = 'media';
globalThis.__LINK_MODE__ = 'static';
const require = createRequire(import.meta.url);
const { renderToString } = require(path.join(reactHome, 'react-dom/server.node.js'));
const React = require(path.join(reactHome, 'react'));

async function renderPage({ name, view, title, props = {} }) {
  const viewPath = path.join(root, 'src/views', `${view}.tsx`);
  const serverOut = path.join(tmp, `${view}.server.cjs`);
  if (!fs.existsSync(serverOut)) await build({ ...common, entryPoints: [viewPath], outfile: serverOut, platform: 'node', format: 'cjs', external: ['react', 'react-dom'] });
  const View = require(serverOut).default;
  const html = renderToString(React.createElement(View, props));

  const bundle = `view-${view.toLowerCase()}.js`;
  if (!builtViews.has(view)) {
    const clientEntry = path.join(tmp, `${view}.client.tsx`);
    fs.writeFileSync(clientEntry, `import { hydrateRoot } from 'react-dom/client';\nimport View from ${JSON.stringify(viewPath)};\nhydrateRoot(document.getElementById('root')!, <View {...((window as any).__PROPS__ || {})} />);\n`);
    await build({ ...common, entryPoints: [clientEntry], outfile: path.join(out, bundle), platform: 'browser', format: 'iife', minify: true });
    builtViews.add(view);
  }

  fs.writeFileSync(path.join(out, `${name}.html`), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="Fanar Estates: villas, penthouses and off-plan residences across Dubai.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500&family=Reem+Kufi:wght@600&display=swap">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div id="root">${html}</div>
<script>window.__MEDIA_BASE__='media';window.__LINK_MODE__='static';window.__PROPS__=${JSON.stringify(props).replace(/</g, '\\u003c')};</script>
<script src="${bundle}"></script>
</body>
</html>
`);
  return html;
}

const builtViews = new Set();
const linked = new Set();
for (const p of pages) {
  const html = await renderPage(p);
  for (const m of html.matchAll(/href="([a-z0-9-]+)\.html/g)) linked.add(m[1]);
}
for (const name of linked) {
  if (pages.some((p) => p.name === name)) continue;
  const key = Object.keys(soonTitles).find((k) => name === k || name.startsWith(`${k}-`));
  const title = soonTitles[name] ?? (key ? soonTitles[key] : 'This page');
  await renderPage({ name, view: 'Soon', title: `${title} · Fanar Estates`, props: { title } });
}

fs.copyFileSync(path.join(root, 'src/styles/globals.css'), path.join(out, 'styles.css'));
fs.cpSync(path.join(root, 'public/media'), path.join(out, 'media'), { recursive: true });
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* temp folder is cleaned on the next build */ }
console.log(`Built ${pages.length} page(s) and ${linked.size} linked placeholder(s) into dist/`);
