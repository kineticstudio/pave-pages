#!/usr/bin/env node
/**
 * Rebuilds this repo from Kinetic's Pave prototype (the pave-v2 repository
 * behind pave.kineticstudio.com): the navigation and the research pages.
 * Kinetic runs it after every design change, then commits, so each change
 * arrives here as a readable diff. Nothing in it is needed for the Webflow
 * build.
 *
 *   PAVE=/path/to/pave-v2 npm run sync
 *
 * 1. Serves pave-v2 and opens each page in headless Chromium twice. Once in
 *    full, scrolled top to bottom, to record every file it loads. Once with
 *    the motion and the menus held back, to capture the markup the page's own
 *    scripts write (the nav, the content, the footer) before anything
 *    animates it. The research pages get the approved navigation (the Agent
 *    Panel) in place of the one they were reviewed with.
 * 2. Copies only those files to src/, plus the scripts the markup came from
 *    (for reading), and writes each page with its markup in place, so only
 *    the menus (src/nav.js) and the motion (src/research-v3-animations.js)
 *    run on top. Cache stamps (?v=) are dropped; links point at these pages
 *    or at pave.com.
 * 3. Serves the result and loads every page at desktop and phone widths. A
 *    missing file, a script error, a doubled nav or a page that scrolls
 *    sideways fails the sync.
 */
import {promises as fs} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import * as prettier from 'prettier';
import {serve} from './server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAVE = path.resolve(process.env.PAVE || path.join(os.homedir(), 'Developer/kinetic/pave-v2'));
const SITE = 'https://www.pave.com';
const SHOTS = process.env.SHOTS || path.join(os.tmpdir(), 'pave-pages-check');

// The posts, from the prototype's content file.
const sandbox = {window: {}};
vm.runInNewContext(await fs.readFile(path.join(PAVE, 'research-posts.js'), 'utf8'), sandbox);
const POSTS = sandbox.window.PaveResearch;

// Each page: the prototype page and query, the file here, its name, and an
// element that shows it has rendered.
const PAGES = [
  {src: 'nav-v2.html', query: '?product=panel', out: 'nav/index.html', name: 'Navigation', ready: '.nav-card.pm-panel'},
  {src: 'research-c4.html', query: '', out: 'research/index.html', name: 'Research', ready: '[data-rows] .lg-row'},
  ...POSTS.map(p => ({src: 'research-light-post-v3.html', query: `?post=${p.slug}&from=c4`, out: `research/${p.slug}.html`, name: p.title, ready: '[data-title]:not(:empty)'})),
  {src: 'research-light-post-v3.html', query: `?post=${POSTS[0].slug}&from=c4&without=figure,image`, out: 'research/text-only.html', name: 'A post with no number or image', ready: '[data-title]:not(:empty)'},
  // The value calculator stays live: src/calculator-ui.js fills and runs it
  // from src/calculator-data.json, so its scripts stay; the markup is written
  // in as it first renders (Matt's defaults), once the numbers have counted up.
  {src: 'calculator-questions-v2.html', query: '', out: 'calculator/index.html', name: 'Value calculator', ready: '[data-calculator].is-ready', settle: 2000},
];
// Scripts whose only job is writing markup that is now written in.
const RENDERERS = ['nav-v1.js', 'nav-v2.js', 'research-footer.js', 'research-posts.js', 'research-v3.js', 'agent-result.js'];
// Held back while the markup is captured: the menus and the motion.
const BEHAVIOUR = ['nav.js', 'research-v3-animations.js'];
// Not loaded by these pages, but copied for reading: the content and the
// templates the markup was written from.
const REFERENCE = ['research-posts.js', 'research-v3.js', 'nav-v2.js'];
// Loaded by the prototype but not needed here (the Bento menu's Agent demo).
const SKIP = ['agent-result.js', 'agent-result.css'];
// Prototype pages, as this repo's pages or pave.com's.
const ELSEWHERE = {
  'research-c3.html': '/research/',
  'research-c4.html': '/research/',
  'research-d.html': '/research/',
  'research-light-post-v2.html': `/research/${POSTS[0].slug}.html`,
  'research-light-post-v3.html': `/research/${POSTS[0].slug}.html`,
  'index.html': `${SITE}/`,
  'agent-phase-1.html': `${SITE}/products/pave-agent`,
  'customers.html': `${SITE}/customers`,
  'pricing.html': `${SITE}/pricing`,
  'calculator.html': `${SITE}/calculator`,
};
const TEXT = /\.(html|js|mjs|css)$/i;
const STAMP = /\?v=[0-9a-f]+/g;

// The research pages were reviewed with the October 14 nav; Pave approved
// the Agent Panel nav for the site, so they carry that here.
function approvedNav(html) {
  return html
    .replace(/href="nav-v1\.css(?:\?v=[0-9a-f]+)?"/, 'href="nav-v2.css"')
    .replace(/<script src="nav-v1\.js(?:\?v=[0-9a-f]+)?" data-current="resources"><\/script>/, '<script src="nav-v2.js" data-current="ai" data-product="panel"></script>');
}
async function withApprovedNav(page, base) {
  await page.route(url => url.origin === base && /\/research-[\w-]+\.html$/.test(url.pathname), async route => {
    const response = await route.fetch();
    await route.fulfill({response, body: approvedNav(await response.text())});
  });
}
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const stage = document.scrollingElement;
    for (let y = 0; y < stage.scrollHeight; y += 480) { stage.scrollTop = y; await new Promise(r => setTimeout(r, 70)); }
    stage.scrollTop = 0;
  });
  await page.waitForLoadState('networkidle');
}

async function capture(browser, base) {
  const files = new Set(), markup = new Map();
  const record = url => { const u = new URL(url); if (u.origin === base) files.add(decodeURIComponent(u.pathname).slice(1)); };
  for (const page of PAGES) {
    const url = `${base}/${page.src}${page.query}`;
    const full = await browser.newPage({viewport: {width: 1440, height: 900}});
    await withApprovedNav(full, base);
    full.on('requestfinished', request => record(request.url()));
    await full.goto(url, {waitUntil: 'networkidle'});
    await scrollThrough(full);
    await full.close();
    const bare = await browser.newPage({viewport: {width: 1440, height: 900}});
    await withApprovedNav(bare, base);
    await bare.route(u => BEHAVIOUR.includes(u.pathname.split('/').pop()), route => route.abort());
    bare.on('requestfinished', request => record(request.url()));
    await bare.goto(url, {waitUntil: 'networkidle'});
    await bare.waitForSelector(page.ready);
    if (page.settle) await bare.waitForTimeout(page.settle);
    // Lazy images below the fold may never load during capture; take them from the markup.
    for (const src of await bare.evaluate(() => [...document.querySelectorAll('img[src]')].map(img => img.src))) record(src);
    markup.set(page.out, await bare.content());
    await bare.close();
  }
  return {files, markup};
}

// A link or asset in a page, as this repo's or pave.com's.
function relink(value) {
  if (/^(?:[a-z]+:|\/\/|#|\/)/i.test(value)) return value;
  const [rest, hash = ''] = value.split('#');
  const [file, query = ''] = rest.replace(STAMP, '').split('?');
  const params = new URLSearchParams(query.replace(/&amp;/g, '&'));
  if (/^research-light-post-v[23]\.html$/.test(file) && params.get('post')) return `/research/${params.get('post')}.html${hash ? '#' + hash : ''}`;
  if (ELSEWHERE[file]) return ELSEWHERE[file] + (hash ? '#' + hash : '');
  if (/\.[a-z0-9]+$/i.test(file)) return `/src/${file}`;
  return value;
}
// Open Graph: a 1200x630 still for every unfurl, and a short H.264 loop of the
// hero's own motion where it moves. The files are in og/; OG_BASE serves them
// until Pave hosts its own copies.
const OG_BASE = 'https://cdn.jsdelivr.net/gh/kineticstudio/pave-pages@og-2026-10-28/og';
const OG = {
  'research/index.html': {name: 'research', video: true, alt: 'Pave research: the purple gradient shapes beside the title.'},
  'calculator/index.html': {name: 'calculator', video: true, alt: 'Pave value calculator: $38.2M total value per year for 4,500 employees.'},
};
function ogTags(og) {
  const tags = [
    ['og:image', `${OG_BASE}/${og.name}-og.jpg`], ['og:image:type', 'image/jpeg'], ['og:image:width', '1200'], ['og:image:height', '630'], ['og:image:alt', og.alt],
    ...(og.video ? [['og:video', `${OG_BASE}/${og.name}-og.mp4`], ['og:video:secure_url', `${OG_BASE}/${og.name}-og.mp4`], ['og:video:type', 'video/mp4'], ['og:video:width', '1200'], ['og:video:height', '630']] : []),
  ].map(([k, v]) => `<meta property="${k}" content="${v}">`);
  return [...tags, '<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:image" content="${OG_BASE}/${og.name}-og.jpg">`].join('\n');
}
function finish(html, page) {
  html = html.replace(/<script src="([^"?]+)(?:\?v=[0-9a-f]+)?"[^>]*><\/script>/g, (tag, src) => (RENDERERS.includes(src) ? '' : tag));
  html = html.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?v=[0-9a-f]+)?">/g, (tag, href) => (SKIP.includes(href) ? '' : tag));
  html = html.replace(/<!-- The Agent page result chart, for the Bento's Pave Agent card -->/, '');
  // The nav page opens Product on arrival, as in Pave's approved screenshot.
  html = html.replace(/if \(\/\[\?&\]product=\/\.test\(location\.search\) && /, 'if (');
  html = html.replace(/\b(href|src)="([^"]*)"/g, (all, attr, value) => `${attr}="${relink(value)}"`);
  html = html.replace(STAMP, '');
  // The calculator fetches its data file from wherever the page sits.
  html = html.replace(/data-calculator="calculator-data\.json"/, 'data-calculator="/src/calculator-data.json"');
  if (page.out === 'nav/index.html') html = html.replace(/<title>[^<]*<\/title>/, '<title>Pave navigation</title>');
  if (OG[page.out]) html = html.replace(/(<meta name="description"[^>]*>)/, `$1\n${ogTags(OG[page.out])}`);
  const runs = page.src.startsWith('nav') ? 'nothing else runs' : page.src.startsWith('calculator') ? 'src/calculator-ui.js runs the calculator from src/calculator-data.json (with src/calculator-v21.js, the math), and src/research-v3-animations.js the motion' : 'src/research-v3-animations.js the motion';
  const note = `<!-- Generated by tools/sync-from-pave.mjs from pave-v2's ${page.src}${page.query}. The markup is written in; src/nav.js mounts the menus and ${runs}. -->`;
  return html.replace(/^<!DOCTYPE html>/i, `<!doctype html>\n${note}`);
}

async function write(files, markup) {
  await fs.rm(path.join(ROOT, 'src'), {recursive: true, force: true});
  for (const dir of ['nav', 'research', 'calculator']) await fs.rm(path.join(ROOT, dir), {recursive: true, force: true});
  const copied = [];
  for (const file of [...new Set([...files, ...REFERENCE])].sort()) {
    if (file.endsWith('.html') || SKIP.includes(file) || (RENDERERS.includes(file) && !REFERENCE.includes(file)) || !file) continue;
    const source = path.join(PAVE, file), target = path.join(ROOT, 'src', file);
    try { await fs.access(source); } catch { continue; }
    await fs.mkdir(path.dirname(target), {recursive: true});
    if (TEXT.test(file)) await fs.writeFile(target, (await fs.readFile(source, 'utf8')).replace(STAMP, ''));
    else await fs.copyFile(source, target);
    copied.push(file);
  }
  for (const page of PAGES) {
    const target = path.join(ROOT, page.out);
    await fs.mkdir(path.dirname(target), {recursive: true});
    await fs.writeFile(target, await prettier.format(finish(markup.get(page.out), page), {parser: 'html', printWidth: 120}));
  }
  const list = PAGES.map(p => `      <li><a href="/${p.out.replace(/index\.html$/, '')}">${p.name}</a></li>`).join('\n');
  await fs.writeFile(path.join(ROOT, 'index.html'), `<!doctype html>
<!-- Generated by tools/sync-from-pave.mjs. -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Pave pages</title>
    <link rel="stylesheet" href="/src/research-v3.css" />
    <style>
      body { margin: 0; padding: 64px 24px; background: #fff; }
      main { max-width: 640px; margin: 0 auto; }
      h1 { margin: 0 0 8px; font-size: 44px; font-weight: 500; letter-spacing: -0.03em; }
      p { margin: 0 0 32px; color: var(--ink-muted); }
      ul { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--hairline); }
      li a { display: block; padding: 14px 0; border-bottom: 1px solid var(--hairline); color: inherit; text-decoration: none; }
      li a:hover { color: var(--blue); }
    </style>
  </head>
  <body>
    <main>
      <h1>Pave pages</h1>
      <p>Coded reference for the Webflow build. See README.md for how the pages are put together.</p>
      <ul>
${list}
      </ul>
    </main>
  </body>
</html>
`);
  return copied;
}

async function verify(browser) {
  const {server, url: base} = await serve([['/', ROOT]]);
  const problems = [];
  await fs.mkdir(SHOTS, {recursive: true});
  for (const page of PAGES) {
    for (const [label, viewport] of [['desktop', {width: 1440, height: 900}], ['phone', {width: 390, height: 844}]]) {
      const tab = await browser.newPage({viewport});
      const say = text => problems.push(`${page.out} (${label}): ${text}`);
      tab.on('response', response => { const u = new URL(response.url()); if (u.origin === base && response.status() >= 400 && u.pathname !== '/favicon.ico') say(`${response.status()} ${u.pathname}`); });
      tab.on('pageerror', error => say(error.message));
      tab.on('console', message => { if (message.type() === 'error' && !/favicon|Failed to load resource/.test(message.text())) say(message.text()); });
      await tab.goto(`${base}/${page.out}`, {waitUntil: 'networkidle'});
      await tab.waitForTimeout(1500);
      const name = page.out.replace(/\//g, '-').replace(/\.html$/, '');
      await tab.screenshot({path: path.join(SHOTS, `${name}-${label}.png`)});
      await scrollThrough(tab);
      const state = await tab.evaluate(() => ({
        navs: document.querySelectorAll('nav.nav').length,
        sheet: !!document.querySelector('.nav-mobile'),
        footers: document.querySelectorAll('footer.footer').length,
        rows: document.querySelectorAll('.lg--v2 .lg-row').length,
        more: !!document.querySelector('.lg-more'),
        h1: document.querySelectorAll('h1').length,
        wide: document.documentElement.scrollWidth > innerWidth + 1,
      }));
      if (state.navs !== 1) say(`expected one nav, found ${state.navs}`);
      if (label === 'phone' && !state.sheet) say('the phone menu did not mount');
      if (state.wide) say('the page scrolls sideways');
      if (page.out.startsWith('research/')) {
        if (state.footers !== 1) say(`expected one footer, found ${state.footers}`);
        if (state.h1 !== 1) say(`expected one h1, found ${state.h1}`);
      }
      if (page.out === 'research/index.html' && state.rows !== POSTS.length) say(`expected ${POSTS.length} rows, found ${state.rows}`);
      await tab.close();
    }
  }
  server.close();
  return problems;
}

const pave = await serve([['/', PAVE]]);
const browser = await chromium.launch();
try {
  const {files, markup} = await capture(browser, pave.url);
  const copied = await write(files, markup);
  console.log(`Wrote ${PAGES.length} pages and ${copied.length} files from ${PAVE}`);
  const problems = await verify(browser);
  console.log(problems.length ? `Problems:\n  ${problems.join('\n  ')}` : `Checked every page at 1440 and 390: no missing files or errors. Screenshots: ${SHOTS}`);
  if (problems.length) process.exitCode = 1;
} finally {
  await browser.close();
  pave.server.close();
}
