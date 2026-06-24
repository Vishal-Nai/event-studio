import type { PhotoArea } from "@/types";

const W = 1080;
const H = 1080;
const F = "'Geist','Inter',-apple-system,BlinkMacSystemFont,sans-serif";

// ─── Types ───────────────────────────────────────────────────────────────────

export type FrameLayout =
  | "bottom-strip"
  | "side-panel"
  | "top-strip"
  | "corner-badge"
  | "full-overlay"
  | "text-card";

export type CustomFrameElement = "logo" | "title" | "status";

export interface CustomFramePosition {
  x: number;
  y: number;
}

export interface CustomFrameConfig {
  layout: FrameLayout;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  overlayOpacity: number; // 0–100, used for overlay/badge alpha
  showBorder: boolean;
  borderWidth: number;
  showLogo: boolean;
  logoText: string;
  showEventName: boolean;
  showTagline: boolean;
  showDate: boolean;
  showLocation: boolean;
  showHashtags: boolean;
  showStatus: boolean;
  showWebsite: boolean;
  eventName: string;
  tagline: string;
  date: string;
  location: string;
  hashtags: string;
  statusText: string;
  website: string;
  positions?: Partial<Record<CustomFrameElement, CustomFramePosition>>;
}

export const DEFAULT_CUSTOM_CONFIG: CustomFrameConfig = {
  layout: "bottom-strip",
  primaryColor: "#09090c",
  secondaryColor: "#2a1f44",
  textColor: "#ffffff",
  overlayOpacity: 85,
  showBorder: false,
  borderWidth: 8,
  showLogo: true,
  logoText: "Cursor",
  showEventName: true,
  showTagline: true,
  showDate: true,
  showLocation: true,
  showHashtags: true,
  showStatus: true,
  showWebsite: false,
  eventName: "/Dubai Meetup",
  tagline: "AI coding agent for building ambitious software",
  date: "July 2026",
  location: "Dubai, UAE",
  hashtags: "#CursorAI, #DevCommunity, #TechMeetup",
  statusText: "I'm Attending",
  website: "cursor.com",
};

export const LAYOUT_META: Record<FrameLayout, { name: string; description: string }> = {
  "bottom-strip": { name: "Bottom Strip",  description: "Full photo with a branding bar at the bottom" },
  "side-panel":   { name: "Side Panel",    description: "Left column for branding, photo fills the right" },
  "top-strip":    { name: "Top + Bottom",  description: "Header and footer bars around the photo" },
  "corner-badge": { name: "Corner Badge",  description: "Photo fills frame, compact badge in the corner" },
  "full-overlay": { name: "Full Overlay",  description: "Gradient overlay rises from the bottom of the photo" },
  "text-card":    { name: "Text Card",     description: "Pure design card — no photo needed" },
};

export function getCustomFramePhotoArea(layout: FrameLayout): PhotoArea | null {
  switch (layout) {
    case "bottom-strip": return { x: 0,   y: 0,   width: 1080, height: 860  };
    case "side-panel":   return { x: 340, y: 0,   width: 740,  height: 1080 };
    case "top-strip":    return { x: 0,   y: 130, width: 1080, height: 820  };
    case "corner-badge": return { x: 0,   y: 0,   width: 1080, height: 1080 };
    case "full-overlay": return { x: 0,   y: 0,   width: 1080, height: 1080 };
    case "text-card":    return null;
  }
}

// ─── SVG Helpers ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
}

function cubeIcon(cx: number, cy: number, sz: number, color: string): string {
  const s = sz / 40;
  const p = (px: number, py: number) =>
    `${(cx + (px - 20) * s).toFixed(1)},${(cy + (py - 20) * s).toFixed(1)}`;
  return [
    `<polygon points="${p(20,3)} ${p(37,12)} ${p(20,21)} ${p(3,12)}" fill="${color}" fill-opacity=".90"/>`,
    `<polygon points="${p(37,12)} ${p(37,29)} ${p(20,38)} ${p(20,21)}" fill="${color}" fill-opacity=".42"/>`,
    `<polygon points="${p(3,12)} ${p(20,21)} ${p(20,38)} ${p(3,29)}" fill="${color}" fill-opacity=".18"/>`,
    `<polygon points="${p(13,16)} ${p(28,7)} ${p(22,22)}" fill="${color}"/>`,
  ].join("");
}

// Logo block positioned by top-left at (lx, ly)
function logoAt(lx: number, ly: number, sz: number, text: string, color: string): string {
  const fs = Math.round(sz * 0.72);
  const gap = Math.round(sz * 0.38);
  return `${cubeIcon(lx + sz / 2, ly + sz / 2, sz, color)}<text x="${lx + sz + gap}" y="${ly + sz / 2 + 1}" dominant-baseline="central" font-family="${F}" font-size="${fs}" font-weight="600" letter-spacing="-.3" fill="${color}">${esc(text)}</text>`;
}

// Logo block centered horizontally at cx
function logoCentered(cx: number, ly: number, sz: number, text: string, color: string): string {
  const fs = Math.round(sz * 0.72);
  const gap = Math.round(sz * 0.38);
  const approxW = sz + gap + text.length * fs * 0.58;
  return logoAt(cx - approxW / 2, ly, sz, text, color);
}

function position(
  c: CustomFrameConfig,
  element: CustomFrameElement,
  fallback: CustomFramePosition
): CustomFramePosition {
  return c.positions?.[element] ?? fallback;
}

// Badge pill — returns both SVG and computed width so callers can right-align
function badgePill(text: string, x: number, y: number, h: number, color: string): { svg: string; w: number } {
  const fs = Math.round(h * 0.48);
  const px = Math.round(h * 0.62);
  const w = Math.round(text.length * fs * 0.56 + px * 2);
  const r = Math.round(h / 2);
  const svg =
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}" fill-opacity=".18" stroke="${color}" stroke-opacity=".40" stroke-width="1.5"/>` +
    `<text x="${x + w / 2}" y="${y + h / 2}" dominant-baseline="central" text-anchor="middle" font-family="${F}" font-size="${fs}" font-weight="600" fill="${color}" fill-opacity=".90">${esc(text)}</text>`;
  return { svg, w };
}

// Hashtag chips row left-to-right from (x, y)
function chipRow(raw: string, x: number, y: number, h: number, maxW: number, color: string): string {
  const tagList = raw.split(/,\s*/).map(t => t.trim()).filter(Boolean).slice(0, 7);
  const fs = Math.round(h * 0.50);
  const px = Math.round(h * 0.55);
  const r = Math.round(h / 2);
  const gap = 8;
  let cx = x;
  let out = "";
  for (const tag of tagList) {
    const w = Math.round(tag.length * fs * 0.57) + px * 2;
    if (cx + w > x + maxW) break;
    out += `<rect x="${cx}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}" fill-opacity=".18"/>`;
    out += `<text x="${cx + px}" y="${y + h / 2}" dominant-baseline="central" font-family="${F}" font-size="${fs}" font-weight="500" fill="${color}" fill-opacity=".75">${esc(tag)}</text>`;
    cx += w + gap;
  }
  return out;
}

// Approximate total chips width (for centering)
function chipsWidth(raw: string, h: number, maxTags = 7): number {
  const tagList = raw.split(/,\s*/).map(t => t.trim()).filter(Boolean).slice(0, maxTags);
  const fs = Math.round(h * 0.50);
  const px = Math.round(h * 0.55);
  return tagList.reduce((sum, t, i) => sum + Math.round(t.length * fs * 0.57) + px * 2 + (i > 0 ? 8 : 0), 0);
}

// Compute badge width without rendering
function badgeW(text: string, h: number): number {
  const fs = Math.round(h * 0.48);
  const px = Math.round(h * 0.62);
  return Math.round(text.length * fs * 0.56 + px * 2);
}

// Date · Location · Website detail line
type MetaItem = [show: boolean, value: string];
function metaLine(
  items: MetaItem[],
  x: number,
  y: number,
  fs: number,
  color: string,
  opacity: number,
  anchor: "start" | "middle" | "end" = "start",
): string {
  const parts = items.filter(([show, v]) => show && v.trim()).map(([, v]) => esc(trunc(v, 32)));
  if (!parts.length) return "";
  const ta = anchor !== "start" ? ` text-anchor="${anchor}"` : "";
  return `<text x="${x}" y="${y}" font-family="${F}" font-size="${fs}" fill="${color}" fill-opacity="${opacity}"${ta}>${parts.join("  ·  ")}</text>`;
}

// ─── Layout generators ───────────────────────────────────────────────────────

function layoutBottomStrip(c: CustomFrameConfig): string {
  const panelY = 860;
  const { primaryColor: pc, textColor: tc } = c;
  const out: string[] = [];

  out.push(`<rect x="0" y="${panelY}" width="${W}" height="${H - panelY}" fill="${pc}"/>`);
  out.push(`<line x1="0" y1="${panelY}" x2="${W}" y2="${panelY}" stroke="${tc}" stroke-opacity=".06" stroke-width="1"/>`);

  const logoSz = 36;
  const logoTopY = panelY + 44;

  if (c.showLogo) {
    const p = position(c, "logo", { x: 44, y: logoTopY });
    out.push(logoAt(p.x, p.y, logoSz, c.logoText, tc));
  }

  if (c.showStatus) {
    const bh = 28;
    const p = position(c, "status", {
      x: W - 44 - badgeW(c.statusText, bh),
      y: logoTopY + (logoSz - bh) / 2,
    });
    out.push(badgePill(c.statusText, p.x, p.y, bh, tc).svg);
  }

  const enY  = panelY + 118;
  const tlY  = panelY + 156;
  const metY = panelY + 185;
  const chY  = panelY + 210;

  if (c.showEventName) {
    const p = position(c, "title", { x: 44, y: enY });
    out.push(`<text x="${p.x}" y="${p.y}" font-family="${F}" font-size="44" font-weight="800" letter-spacing="-.6" fill="${tc}">${esc(trunc(c.eventName, 24))}</text>`);
  }
  if (c.showTagline && c.tagline.trim()) {
    out.push(`<text x="44" y="${tlY}" font-family="${F}" font-size="21" fill="${tc}" fill-opacity=".55">${esc(trunc(c.tagline, 56))}</text>`);
  }
  out.push(metaLine([[c.showDate, c.date], [c.showLocation, c.location], [c.showWebsite, c.website]], 44, metY, 19, tc, 0.40));
  if (c.showHashtags) out.push(chipRow(c.hashtags, 44, chY - 26, 26, W - 88, tc));

  return out.join("\n");
}

function layoutSidePanel(c: CustomFrameConfig): string {
  const panelW = 340;
  const { primaryColor: pc, secondaryColor: sc, textColor: tc } = c;
  const out: string[] = [];

  // Panel gradient
  out.push(`<defs><linearGradient id="sp-grad" x1="1" y1="0" x2="0" y2="0"><stop offset="0%" stop-color="${sc}" stop-opacity=".6"/><stop offset="100%" stop-color="${pc}"/></linearGradient></defs>`);
  out.push(`<rect x="0" y="0" width="${panelW}" height="${H}" fill="url(#sp-grad)"/>`);
  out.push(`<line x1="${panelW}" y1="0" x2="${panelW}" y2="${H}" stroke="${tc}" stroke-opacity=".06" stroke-width="1"/>`);

  if (c.showLogo) {
    const p = position(c, "logo", { x: 40, y: 54 });
    out.push(logoAt(p.x, p.y, 34, c.logoText, tc));
  }

  out.push(`<line x1="40" y1="118" x2="${panelW - 40}" y2="118" stroke="${tc}" stroke-opacity=".14" stroke-width="1"/>`);

  if (c.showEventName) {
    const fs = c.eventName.length > 16 ? 30 : c.eventName.length > 12 ? 36 : 42;
    const p = position(c, "title", { x: 40, y: 170 });
    out.push(`<text x="${p.x}" y="${p.y}" font-family="${F}" font-size="${fs}" font-weight="800" letter-spacing="-.5" fill="${tc}">${esc(trunc(c.eventName, 18))}</text>`);
  }
  if (c.showTagline && c.tagline.trim()) {
    const line1 = trunc(c.tagline, 28);
    const line2 = c.tagline.length > 28 ? trunc(c.tagline.slice(28), 28) : "";
    out.push(`<text x="40" y="228" font-family="${F}" font-size="18" fill="${tc}" fill-opacity=".55">${esc(line1)}</text>`);
    if (line2) out.push(`<text x="40" y="252" font-family="${F}" font-size="18" fill="${tc}" fill-opacity=".55">${esc(line2)}</text>`);
  }

  if (c.showStatus) {
    const by = c.tagline.trim() ? 290 : 262;
    const p = position(c, "status", { x: 40, y: by });
    out.push(badgePill(c.statusText, p.x, p.y, 28, tc).svg);
  }

  out.push(`<line x1="40" y1="348" x2="${panelW - 40}" y2="348" stroke="${tc}" stroke-opacity=".10" stroke-width="1"/>`);

  let metaY = 380;
  if (c.showDate && c.date.trim()) {
    out.push(`<text x="40" y="${metaY}" font-family="${F}" font-size="18" fill="${tc}" fill-opacity=".50">${esc(trunc(c.date, 24))}</text>`);
    metaY += 34;
  }
  if (c.showLocation && c.location.trim()) {
    out.push(`<text x="40" y="${metaY}" font-family="${F}" font-size="18" fill="${tc}" fill-opacity=".50">${esc(trunc(c.location, 24))}</text>`);
    metaY += 34;
  }
  if (c.showWebsite && c.website.trim()) {
    out.push(`<text x="40" y="${metaY}" font-family="${F}" font-size="18" fill="${tc}" fill-opacity=".50">${esc(trunc(c.website, 24))}</text>`);
  }

  if (c.showHashtags) out.push(chipRow(c.hashtags, 40, H - 80, 24, panelW - 80, tc));

  return out.join("\n");
}

function layoutTopStrip(c: CustomFrameConfig): string {
  const topH = 130;
  const botH = 130;
  const botY = H - botH;
  const { primaryColor: pc, secondaryColor: sc, textColor: tc } = c;
  const out: string[] = [];

  out.push(`<rect x="0" y="0" width="${W}" height="${topH}" fill="${pc}"/>`);
  out.push(`<rect x="0" y="${botY}" width="${W}" height="${botH}" fill="${sc}"/>`);
  out.push(`<line x1="0" y1="${topH}" x2="${W}" y2="${topH}" stroke="${tc}" stroke-opacity=".06" stroke-width="1"/>`);
  out.push(`<line x1="0" y1="${botY}" x2="${W}" y2="${botY}" stroke="${tc}" stroke-opacity=".06" stroke-width="1"/>`);

  // Top bar: logo left, event name center, status right
  const topMid = topH / 2;
  if (c.showLogo) {
    const p = position(c, "logo", { x: 44, y: topMid - 17 });
    out.push(logoAt(p.x, p.y, 34, c.logoText, tc));
  }
  if (c.showEventName) {
    const p = position(c, "title", { x: W / 2, y: topMid + 1 });
    out.push(`<text x="${p.x}" y="${p.y}" dominant-baseline="central" text-anchor="middle" font-family="${F}" font-size="28" font-weight="700" letter-spacing="-.3" fill="${tc}">${esc(trunc(c.eventName, 28))}</text>`);
  }
  if (c.showStatus) {
    const bh = 26;
    const p = position(c, "status", {
      x: W - 44 - badgeW(c.statusText, bh),
      y: topMid - bh / 2,
    });
    out.push(badgePill(c.statusText, p.x, p.y, bh, tc).svg);
  }

  // Bottom bar: date·location left, hashtags right
  const botMid = botY + botH / 2;
  out.push(metaLine([[c.showDate, c.date], [c.showLocation, c.location], [c.showWebsite, c.website]], 44, botMid + 1, 22, tc, 0.55, "start"));
  if (c.showHashtags) {
    const cw = chipsWidth(c.hashtags, 26, 3);
    out.push(chipRow(c.hashtags.split(",").slice(0, 3).join(","), W - 44 - cw, botMid - 13, 26, cw + 8, tc));
  }

  return out.join("\n");
}

function layoutCornerBadge(c: CustomFrameConfig): string {
  const bX = 660, bY = 850, bW = 420, bH = 230;
  const { primaryColor: pc, textColor: tc, overlayOpacity: op } = c;
  const out: string[] = [];

  // Badge with rounded top-left corner
  const opVal = (op / 100).toFixed(2);
  out.push(`<rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" rx="16" fill="${pc}" fill-opacity="${opVal}"/>`);
  out.push(`<rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" rx="16" fill="none" stroke="${tc}" stroke-opacity=".08" stroke-width="1"/>`);

  const logoSz = 32;
  if (c.showLogo) {
    const p = position(c, "logo", { x: bX + 30, y: bY + 28 });
    out.push(logoAt(p.x, p.y, logoSz, c.logoText, tc));
  }

  if (c.showEventName) {
    const p = position(c, "title", { x: bX + 30, y: bY + 106 });
    out.push(`<text x="${p.x}" y="${p.y}" font-family="${F}" font-size="32" font-weight="800" letter-spacing="-.4" fill="${tc}">${esc(trunc(c.eventName, 16))}</text>`);
  }
  if (c.showStatus) {
    const p = position(c, "status", { x: bX + 30, y: bY + 144 });
    out.push(badgePill(c.statusText, p.x, p.y, 26, tc).svg);
  }
  out.push(metaLine([[c.showDate, c.date], [c.showLocation, c.location]], bX + 30, bY + 198, 18, tc, 0.45));

  return out.join("\n");
}

function layoutFullOverlay(c: CustomFrameConfig): string {
  const { primaryColor: pc, textColor: tc, overlayOpacity: op } = c;
  const out: string[] = [];

  const opStr = (op / 100).toFixed(2);
  out.push(`<defs><linearGradient id="fo-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="25%" stop-color="${pc}" stop-opacity="0"/><stop offset="100%" stop-color="${pc}" stop-opacity="${opStr}"/></linearGradient></defs>`);
  out.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#fo-grad)"/>`);

  // Build content from bottom up
  let y = H - 44;

  if (c.showHashtags && c.hashtags.trim()) {
    out.push(chipRow(c.hashtags, 52, y - 28, 28, W - 104, tc));
    y -= 56;
  }
  const mLine = metaLine([[c.showDate, c.date], [c.showLocation, c.location], [c.showWebsite, c.website]], 52, y, 21, tc, 0.50);
  if (mLine) { out.push(mLine); y -= 44; }

  if (c.showTagline && c.tagline.trim()) {
    out.push(`<text x="52" y="${y}" font-family="${F}" font-size="23" fill="${tc}" fill-opacity=".60">${esc(trunc(c.tagline, 52))}</text>`);
    y -= 50;
  }
  if (c.showEventName) {
    const p = position(c, "title", { x: 52, y });
    out.push(`<text x="${p.x}" y="${p.y}" font-family="${F}" font-size="54" font-weight="800" letter-spacing="-.6" fill="${tc}">${esc(trunc(c.eventName, 20))}</text>`);
    y -= 70;
  }
  if (c.showStatus) {
    const p = position(c, "status", { x: 52, y: y - 30 });
    const { svg: bSvg, w: bw } = badgePill(c.statusText, p.x, p.y, 28, tc);
    void bw;
    out.push(bSvg);
    y -= 60;
  }
  if (c.showLogo) {
    const p = position(c, "logo", { x: 52, y: y - 38 });
    out.push(logoAt(p.x, p.y, 36, c.logoText, tc));
  }

  return out.join("\n");
}

function layoutTextCard(c: CustomFrameConfig): string {
  const { primaryColor: pc, secondaryColor: sc, textColor: tc } = c;
  const out: string[] = [];

  // Full background
  out.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${pc}"/>`);

  // Subtle grid
  out.push(`<defs><pattern id="tc-grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M 72 0 L 0 0 0 72" fill="none" stroke="${tc}" stroke-opacity=".04" stroke-width="1"/></pattern></defs>`);
  out.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#tc-grid)"/>`);

  // Accent top stripe
  out.push(`<rect x="0" y="0" width="${W}" height="8" fill="${sc}"/>`);
  // Diagonal accent corner (visual interest)
  out.push(`<path d="M 0 0 L 220 0 L 0 220 Z" fill="${sc}" fill-opacity=".10"/>`);

  let y = 200;

  if (c.showLogo) {
    const p = position(c, "logo", { x: W / 2, y });
    out.push(logoCentered(p.x, p.y, 44, c.logoText, tc));
    y += 80;
  }

  if (c.showEventName) {
    const nameLen = c.eventName.length;
    const fs = nameLen > 22 ? 52 : nameLen > 16 ? 64 : nameLen > 12 ? 72 : 84;
    const p = position(c, "title", { x: W / 2, y });
    out.push(`<text x="${p.x}" y="${p.y}" text-anchor="middle" font-family="${F}" font-size="${fs}" font-weight="800" letter-spacing="-1" fill="${tc}">${esc(trunc(c.eventName, 22))}</text>`);
    y += fs + 20;
  }

  if (c.showTagline && c.tagline.trim()) {
    out.push(`<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${F}" font-size="26" fill="${tc}" fill-opacity=".50">${esc(trunc(c.tagline, 50))}</text>`);
    y += 60;
  }

  // Divider
  out.push(`<line x1="${W * 0.33}" y1="${y}" x2="${W * 0.67}" y2="${y}" stroke="${tc}" stroke-opacity=".15" stroke-width="1.5"/>`);
  y += 46;

  if (c.showStatus) {
    const bh = 34;
    const p = position(c, "status", {
      x: Math.round(W / 2 - badgeW(c.statusText, bh) / 2),
      y,
    });
    out.push(badgePill(c.statusText, p.x, p.y, bh, tc).svg);
    y += 68;
  }

  const mLine = metaLine(
    [[c.showDate, c.date], [c.showLocation, c.location], [c.showWebsite, c.website]],
    W / 2, y, 24, tc, 0.45, "middle"
  );
  if (mLine) { out.push(mLine); y += 54; }

  if (c.showHashtags && c.hashtags.trim()) {
    const cw = Math.min(chipsWidth(c.hashtags, 32, 5), W - 88);
    const chipX = Math.round((W - cw) / 2);
    out.push(chipRow(c.hashtags, chipX, y, 32, W - 88, tc));
  }

  // Accent bottom stripe
  out.push(`<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${sc}"/>`);

  return out.join("\n");
}

// ─── Public API ──────────────────────────────────────────────────────────────

function wrapSvg(inner: string, c: CustomFrameConfig): string {
  const bw = c.showBorder ? c.borderWidth : 0;
  const border = bw > 0
    ? `<rect x="${bw / 2}" y="${bw / 2}" width="${W - bw}" height="${H - bw}" fill="none" stroke="${c.textColor}" stroke-opacity=".25" stroke-width="${bw}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inner}${border}</svg>`;
}

export function generateCustomFrame(config: CustomFrameConfig): string {
  let inner: string;
  switch (config.layout) {
    case "bottom-strip": inner = layoutBottomStrip(config); break;
    case "side-panel":   inner = layoutSidePanel(config);   break;
    case "top-strip":    inner = layoutTopStrip(config);    break;
    case "corner-badge": inner = layoutCornerBadge(config); break;
    case "full-overlay": inner = layoutFullOverlay(config); break;
    case "text-card":    inner = layoutTextCard(config);    break;
  }
  return `data:image/svg+xml,${encodeURIComponent(wrapSvg(inner, config))}`;
}
