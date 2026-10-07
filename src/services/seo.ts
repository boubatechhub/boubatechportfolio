import { seoAbsoluteAsset, seoAbsoluteUrl } from "../constants/seo";

export type SeoInput = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: Record<string, unknown> | null;
};

function ensureMeta(selector: string, create: () => HTMLMetaElement): HTMLMetaElement {
  const existing = document.querySelector(selector);
  if (existing && existing instanceof HTMLMetaElement) return existing;
  const el = create();
  document.head.appendChild(el);
  return el;
}

function setMetaName(name: string, content: string) {
  const el = ensureMeta(`meta[name="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("name", name);
    return m;
  });
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  const el = ensureMeta(`meta[property="${property}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("property", property);
    return m;
  });
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  const existing = document.querySelector('link[rel="canonical"]');
  const link =
    existing && existing instanceof HTMLLinkElement
      ? existing
      : document.createElement("link");
  link.setAttribute("rel", "canonical");
  link.setAttribute("href", href);
  if (!existing) document.head.appendChild(link);
}

function setJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }

  const script =
    existing && existing instanceof HTMLScriptElement
      ? existing
      : document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
}

export function applySeo(input: SeoInput) {
  if (input.title) document.title = input.title;
  if (input.description) setMetaName("description", input.description);
  if (input.robots) setMetaName("robots", input.robots);

  const canonicalUrl = input.canonicalPath
    ? seoAbsoluteUrl(input.canonicalPath)
    : null;
  if (canonicalUrl) setCanonical(canonicalUrl);

  const ogImageAbs = input.ogImage
    ? seoAbsoluteAsset(input.ogImage)
    : seoAbsoluteAsset("/og.svg");

  // OpenGraph
  if (input.title) setMetaProperty("og:title", input.title);
  if (input.description) setMetaProperty("og:description", input.description);
  setMetaProperty("og:url", canonicalUrl || window.location.href);
  setMetaProperty("og:type", input.ogType || "website");
  setMetaProperty("og:image", ogImageAbs);

  // Twitter
  setMetaName("twitter:card", input.twitterCard || "summary_large_image");
  if (input.title) setMetaName("twitter:title", input.title);
  if (input.description) setMetaName("twitter:description", input.description);
  setMetaName("twitter:image", ogImageAbs);

  // JSON-LD
  setJsonLd("jsonld-primary", input.jsonLd ?? null);
}

