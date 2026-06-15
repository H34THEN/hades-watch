import { validateOutboundUrl } from "@/lib/net-neighbors/validation";
import { sanitizeProfileHtml } from "@/lib/profile-customization/sanitize";

export interface RssFeedItem {
  title: string;
  link: string;
  date?: string;
}

export interface RssFeedPreview {
  title: string;
  items: RssFeedItem[];
}

function extractTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = re.exec(block);
  if (!match) return null;
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").replace(/<[^>]+>/g, "").trim();
}

function parseFeedXml(xml: string, maxItems = 5): { title: string; items: RssFeedItem[] } {
  const channelTitle = extractTag(xml, "title") ?? "Feed";
  const items: RssFeedItem[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null && items.length < maxItems) {
    const block = match[0];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate") ?? extractTag(block, "updated");
    if (title && link) {
      items.push({ title: title.slice(0, 200), link: link.slice(0, 2048), date: pubDate ?? undefined });
    }
  }
  return { title: channelTitle.slice(0, 120), items };
}

export async function fetchRssFeedPreview(url: string): Promise<RssFeedPreview | null> {
  const validated = validateOutboundUrl(url);
  if (!validated.ok) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(validated.url, {
      signal: controller.signal,
      headers: { Accept: "application/rss+xml, application/xml, text/xml, */*" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    if (xml.length > 500_000) return null;
    return parseFeedXml(xml, 5);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function buildRssEmbedHtml(feeds: { url: string; title?: string }[]): Promise<string> {
  const sections: string[] = [];
  for (const feed of feeds.slice(0, 3)) {
    const preview = await fetchRssFeedPreview(feed.url);
    if (!preview || preview.items.length === 0) continue;
    const heading = sanitizeProfileHtml(feed.title || preview.title);
    const items = preview.items
      .map(
        (item) =>
          `<li><a href="${item.link.replace(/"/g, "%22")}" target="_blank" rel="noopener noreferrer">${sanitizeProfileHtml(item.title)}</a>${item.date ? ` <small>(${sanitizeProfileHtml(item.date)})</small>` : ""}</li>`,
      )
      .join("");
    sections.push(`<div class="rss-feed"><h3>${heading}</h3><ul>${items}</ul></div>`);
  }
  return sections.join("");
}
