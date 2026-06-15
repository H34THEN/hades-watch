import sanitizeHtml from "sanitize-html";

export const PROFILE_HTML_MAX = 20_000;
export const PROFILE_CSS_MAX = 20_000;
export const PROFILE_RSS_MAX = 5;
export const PROFILE_LINKS_MAX = 20;
export const PROFILE_BUTTONS_MAX = 20;

const ALLOWED_TAGS = [
  "a",
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "small",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "img",
  "marquee",
  "div",
  "span",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "section",
  "article",
  "header",
  "footer",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "title", "target", "rel", "class", "id"],
  img: ["src", "alt", "title", "width", "height", "class", "id"],
  div: ["class", "id"],
  span: ["class", "id"],
  p: ["class", "id"],
  h1: ["class", "id"],
  h2: ["class", "id"],
  h3: ["class", "id"],
  h4: ["class", "id"],
  section: ["class", "id"],
  article: ["class", "id"],
  header: ["class", "id"],
  footer: ["class", "id"],
  table: ["class", "id"],
  thead: ["class", "id"],
  tbody: ["class", "id"],
  tr: ["class", "id"],
  th: ["class", "id"],
  td: ["class", "id"],
  ul: ["class", "id"],
  ol: ["class", "id"],
  li: ["class", "id"],
};

function isSafeHref(href: string): boolean {
  const trimmed = href.trim().toLowerCase();
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:")
  );
}

function isSafeImgSrc(src: string): boolean {
  const trimmed = src.trim().toLowerCase();
  if (trimmed.startsWith("/api/profile-assets/")) return true;
  if (trimmed.startsWith("/api/net-neighbors/banners/")) return true;
  if (trimmed.startsWith("/avatar-assets/")) return true;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return true;
  return false;
}

export function sanitizeProfileHtml(raw: string): string {
  return sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attribs) => ({
        tagName: "a",
        attribs: {
          href: attribs.href && isSafeHref(attribs.href) ? attribs.href : "#",
          title: attribs.title?.slice(0, 120),
          target: "_blank",
          rel: "noopener noreferrer",
          class: attribs.class?.slice(0, 120),
          id: attribs.id?.slice(0, 64),
        },
      }),
      img: (_tag, attribs) => {
        const next: Record<string, string> = {
          src: attribs.src && isSafeImgSrc(attribs.src) ? attribs.src : "",
          alt: attribs.alt?.slice(0, 200) ?? "",
        };
        if (attribs.title) next.title = attribs.title.slice(0, 120);
        if (attribs.class) next.class = attribs.class.slice(0, 120);
        if (attribs.id) next.id = attribs.id.slice(0, 64);
        if (attribs.width?.match(/^\d{1,4}$/)) next.width = attribs.width;
        if (attribs.height?.match(/^\d{1,4}$/)) next.height = attribs.height;
        return { tagName: "img", attribs: next };
      },
    },
  });
}

const UNSAFE_CSS_PATTERNS = [
  /@import/i,
  /expression\s*\(/i,
  /javascript\s*:/i,
  /behavior\s*:/i,
  /-moz-binding/i,
  /url\s*\(\s*['"]?\s*javascript/i,
  /url\s*\(\s*['"]?\s*data:(?!image\/)/i,
];

export function sanitizeProfileCss(raw: string): string {
  let css = raw.slice(0, PROFILE_CSS_MAX);
  for (const pattern of UNSAFE_CSS_PATTERNS) {
    css = css.replace(pattern, "/* blocked */");
  }
  return css;
}

export interface RssFeedInput {
  url: string;
  title?: string;
}

export interface ProfileLinkInput {
  label: string;
  url: string;
}

export interface ProfileButtonInput {
  label: string;
  url: string;
  imageUrl?: string;
}

export function parseRssFeedsInput(raw: unknown): RssFeedInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is { url?: string; title?: string } => !!item && typeof item === "object")
    .map((item) => ({
      url: String(item.url ?? "").trim(),
      title: item.title ? String(item.title).trim().slice(0, 120) : undefined,
    }))
    .filter((f) => f.url.length > 0)
    .slice(0, PROFILE_RSS_MAX);
}

export function parseProfileLinksInput(raw: unknown): ProfileLinkInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is { label?: string; url?: string } => !!item && typeof item === "object")
    .map((item) => ({
      label: String(item.label ?? "").trim().slice(0, 80),
      url: String(item.url ?? "").trim(),
    }))
    .filter((l) => l.label && l.url)
    .slice(0, PROFILE_LINKS_MAX);
}

export function parseProfileButtonsInput(raw: unknown): ProfileButtonInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is { label?: string; url?: string; imageUrl?: string } =>
        !!item && typeof item === "object",
    )
    .map((item) => ({
      label: String(item.label ?? "").trim().slice(0, 80),
      url: String(item.url ?? "").trim(),
      imageUrl: item.imageUrl ? String(item.imageUrl).trim() : undefined,
    }))
    .filter((b) => b.label && b.url)
    .slice(0, PROFILE_BUTTONS_MAX);
}

export function buildProfileIframeDocument(options: {
  sanitizedHtml: string;
  css: string;
  rssHtml?: string;
}): string {
  const css = sanitizeProfileCss(options.css);
  const body = `${options.sanitizedHtml}${options.rssHtml ?? ""}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src http: https: data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none';">
<style>
html, body { margin: 0; padding: 12px; background: #070b0f; color: #c8e6d0; font-family: Georgia, "Times New Roman", serif; font-size: 14px; line-height: 1.5; overflow-wrap: anywhere; }
a { color: #38f8a8; }
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #2a3a32; padding: 4px 8px; }
${css}
</style>
</head>
<body>${body}</body>
</html>`;
}
