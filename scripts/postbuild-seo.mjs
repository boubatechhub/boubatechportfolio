import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL,
  HOME,
  PROJECTS_PAGE,
  OG_IMAGE,
  absoluteUrl,
  personJsonLd,
} from '../config/seo.config.mjs';
import { loadPublishedProjectsForBuild } from './load-published-projects.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const publicDir = join(root, 'public');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function patchHead(html, patches) {
  let out = html;
  for (const [pattern, replacement] of patches) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function injectMeta(html, { title, description, canonicalPath, jsonLd }) {
  const canonical = absoluteUrl(canonicalPath);
  let out = html;

  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`,
  );
  out = out.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonical}$2`,
  );
  out = out.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${escapeHtml(title)}$2`,
  );
  out = out.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`,
  );
  out = out.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonical}$2`,
  );
  out = out.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${escapeHtml(title)}$2`,
  );
  out = out.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${escapeHtml(description)}$2`,
  );

  const ld = JSON.stringify(jsonLd, null, 2);
  if (out.includes('id="jsonld-route"')) {
    out = out.replace(
      /<script type="application\/ld\+json" id="jsonld-route">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" id="jsonld-route">\n${ld}\n</script>`,
    );
  } else {
    out = out.replace(
      '</head>',
      `  <script type="application/ld+json" id="jsonld-route">\n${ld}\n  </script>\n  </head>`,
    );
  }

  return out;
}

function injectNoscript(html, bodyHtml) {
  const block = `<noscript id="seo-prerender">${bodyHtml}</noscript>`;
  if (html.includes('id="seo-prerender"')) {
    return html.replace(
      /<noscript id="seo-prerender">[\s\S]*?<\/noscript>/,
      block,
    );
  }
  return html.replace('<div id="root"></div>', `${block}\n    <div id="root"></div>`);
}

function homeNoscript() {
  return `
      <header>
        <h1>${escapeHtml(HOME.title.split('—')[0].trim())}</h1>
        <p>Développeur Web / Mobile &amp; UI/UX Designer</p>
      </header>
      <main>
        <p>${escapeHtml(HOME.bioShort)}</p>
        <nav aria-label="Sections">
          <ul>
            <li><a href="${absoluteUrl('/#projets')}">Projets</a></li>
            <li><a href="${absoluteUrl('/#contact')}">Contact</a></li>
          </ul>
        </nav>
      </main>`;
}

function projectNoscript(project) {
  const path = `/projets/${project.slug}`;
  return `
      <header>
        <nav aria-label="Fil d'Ariane">
          <a href="${absoluteUrl('/')}">Accueil</a> ›
          <a href="${absoluteUrl('/#projets')}">Projets</a> ›
          <span>${escapeHtml(project.title)}</span>
        </nav>
        <h1>${escapeHtml(project.title)}</h1>
        <p>${escapeHtml(project.category)}</p>
      </header>
      <main>
        <p>${escapeHtml(project.description)}</p>
        <p><a href="${absoluteUrl(path)}">Voir le case study complet</a></p>
      </main>`;
}

function projectsNoscript(projects) {
  const links = projects
    .map(
      (project) => `
        <li>
          <article>
            <h2><a href="${absoluteUrl(`/projets/${project.slug}`)}">${escapeHtml(project.title)}</a></h2>
            <p>${escapeHtml(project.category)}</p>
            <p>${escapeHtml(project.description)}</p>
          </article>
        </li>`,
    )
    .join('');

  return `
      <header>
        <nav aria-label="Fil d'Ariane">
          <a href="${absoluteUrl('/')}">Accueil</a> ›
          <span>Tous les projets</span>
        </nav>
        <h1>Tous les projets</h1>
        <p>${escapeHtml(PROJECTS_PAGE.description)}</p>
      </header>
      <main>
        <ul>${links}
        </ul>
      </main>`;
}

function writeRouteHtml(relativeDir, html) {
  const dir = join(distDir, relativeDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
}

async function generateSitemap(projects) {
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/projets`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/confidentialite`, priority: '0.3', changefreq: 'yearly' },
    ...projects.map((p) => ({
      loc: `${SITE_URL}/projets/${p.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf8');
  writeFileSync(join(distDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`[seo] sitemap.xml — ${urls.length} URL(s).`);
}

async function main() {
  const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf8');
  const projects = await loadPublishedProjectsForBuild();

  const homeHtml = injectNoscript(
    injectMeta(baseHtml, {
      title: HOME.title,
      description: HOME.description,
      canonicalPath: '/',
      jsonLd: personJsonLd(),
    }),
    homeNoscript(),
  );
  writeFileSync(join(distDir, 'index.html'), homeHtml, 'utf8');

  const projectsPageHtml = injectNoscript(
    injectMeta(baseHtml, {
      title: PROJECTS_PAGE.title,
      description: PROJECTS_PAGE.description,
      canonicalPath: '/projets',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: PROJECTS_PAGE.title,
        description: PROJECTS_PAGE.description,
        url: absoluteUrl('/projets'),
        mainEntity: projects.map((project) => ({
          '@type': 'CreativeWork',
          name: project.title,
          url: absoluteUrl(`/projets/${project.slug}`),
        })),
      },
    }),
    projectsNoscript(projects),
  );
  writeRouteHtml('projets', projectsPageHtml);
  console.log('[seo] prerender → /projets');

  for (const project of projects) {
    const path = `/projets/${project.slug}`;
    const title = `${project.title} — Projet ${project.category} | Boubacar Traoré`;
    const description =
      project.description?.slice(0, 160) ||
      `Case study : ${project.title} par Boubacar Traoré.`;

    const projectHtml = injectNoscript(
      injectMeta(baseHtml, {
        title,
        description,
        canonicalPath: path,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description,
          author: { '@type': 'Person', name: 'Boubacar Traoré', url: SITE_URL },
          url: absoluteUrl(path),
        },
      }),
      projectNoscript(project),
    );

    writeRouteHtml(`projets/${project.slug}`, projectHtml);
    console.log(`[seo] prerender → /projets/${project.slug}`);
  }

  await generateSitemap(projects);
  console.log('[seo] postbuild SEO terminé.');
}

main().catch((err) => {
  console.error('[seo] postbuild failed:', err);
  process.exit(1);
});
