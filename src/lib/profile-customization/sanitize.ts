import sanitizeHtml from "sanitize-html";

export const PROFILE_HTML_MAX = 10_000;
export const PROFILE_CSS_MAX = 10_000;
export const PROFILE_RSS_MAX = 3;

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
  "ul",
  "ol",
  "li",
  "blockquote",
  "img",
  "marquee",
  "div",
  "span",
  "hr",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  div: ["class"],
  span: ["class"],
  p: ["class"],
  h1: ["class"],
  h2: ["class"],
  h3: ["class"],
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
  if (trimmed.startsWith("/api/net-neighbors/banners/")) return true;
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
        },
      }),
      img: (_tag, attribs) => {
        const next: Record<string, string> = {
          src: attribs.src && isSafeImgSrc(attribs.src) ? attribs.src : "",
          alt: attribs.alt?.slice(0, 200) ?? "",
        };
        if (attribs.title) next.title = attribs.title.slice(0, 120);
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
html, body { margin: 0; padding: 8px; background: #070b0f; color: #c8e6d0; font-family: Georgia, "Times New Roman", serif; font-size: 14px; line-height: 1.4; overflow-wrap: anywhere; }
a { color: #38f8a8; }
img { max-width: 100%; height: auto; }
${css}
</style>
</head>
<body>${body}</body>
</html>`;
}
