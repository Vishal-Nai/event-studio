import { BrandingConfig, DEFAULT_BRANDING, Frame, FrameStyleId, PhotoArea } from "@/types";
import { cursorLogoSvg } from "@/lib/cursor-logo-svg";
export type { AspectRatio } from "@/types";

const W = 1920;
const H = 1080;

type EventKind = "hackathon" | "meetup" | "cafe" | "announcement" | "thank-you";
type LayoutKind = "hero" | "wide" | "angled" | "bracket" | "minimal";
type DecorKind = "grid" | "cube" | "waves" | "dots" | "city" | "chat" | "coffee" | "megaphone" | "spark" | "heart" | "minimal";
type TextAnchor = "start" | "middle" | "end";

interface FrameTemplate {
  id: FrameStyleId;
  name: string;
  eventKind: EventKind;
  layout: LayoutKind;
  decor: DecorKind;
  title: string;
  subtitle: string;
  slot: PhotoArea | null;
  tags: string[];
  description: string;
}

interface StaticTextLayer {
  x: number;
  y: number;
  maxWidth: number;
  anchor: TextAnchor;
  maxLines?: number;
}

interface ResolvedTextLayer {
  x: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  anchor: TextAnchor;
  maxLines: number;
}

interface ResolvedTextLayout {
  title: ResolvedTextLayer;
  subtitle: ResolvedTextLayer;
}

const FONT_FAMILY = "'Geist','Inter',Arial,sans-serif";
const TITLE_FONT_SIZE = 58;
const SUBTITLE_FONT_SIZE = 24;
const TEXT_ONLY_TITLE_FONT_SIZE = TITLE_FONT_SIZE;
const TITLE_WEIGHT = 830;
const SUBTITLE_WEIGHT = 520;
const LOGO_X = 78;
const LOGO_Y = 58;
const LOGO_HEIGHT = 38;

const TEXT_LAYOUTS: Record<FrameStyleId, { title: StaticTextLayer; subtitle?: StaticTextLayer }> = {
  "hackathon-1": {
    title: { x: 98, y: 232, maxWidth: 360, anchor: "start", maxLines: 3 },
    subtitle: { x: 98, y: 360, maxWidth: 340, anchor: "start" },
  },
  "hackathon-2": {
    title: { x: 98, y: 180, maxWidth: 800, anchor: "start" },
    subtitle: { x: 98, y: 316, maxWidth: 760, anchor: "start" },
  },
  "hackathon-3": {
    title: { x: W / 2, y: 180, maxWidth: 920, anchor: "middle" },
    subtitle: { x: W / 2, y: 316, maxWidth: 760, anchor: "middle" },
  },
  "hackathon-4": {
    title: { x: W / 2, y: 210, maxWidth: 900, anchor: "middle" },
    subtitle: { x: W / 2, y: 295, maxWidth: 560, anchor: "middle" },
  },
  "hackathon-5": {
    title: { x: 1760, y: 180, maxWidth: 720, anchor: "end" },
    subtitle: { x: 1760, y: 316, maxWidth: 620, anchor: "end" },
  },
  "meetup-1": {
    title: { x: 98, y: 180, maxWidth: 820, anchor: "start" },
    subtitle: { x: 98, y: 316, maxWidth: 760, anchor: "start" },
  },
  "meetup-2": {
    title: { x: W / 2, y: 180, maxWidth: 920, anchor: "middle" },
    subtitle: { x: W / 2, y: 316, maxWidth: 800, anchor: "middle" },
  },
  "meetup-3": {
    title: { x: 1760, y: 180, maxWidth: 720, anchor: "end" },
    subtitle: { x: 1760, y: 316, maxWidth: 620, anchor: "end" },
  },
  "meetup-4": {
    title: { x: 520, y: 180, maxWidth: 900, anchor: "start" },
    subtitle: { x: 520, y: 316, maxWidth: 780, anchor: "start" },
  },
  "meetup-5": {
    title: { x: W / 2, y: 180, maxWidth: 920, anchor: "middle" },
    subtitle: { x: W / 2, y: 316, maxWidth: 800, anchor: "middle" },
  },
  "cafe-1": {
    title: { x: 98, y: 232, maxWidth: 360, anchor: "start", maxLines: 3 },
    subtitle: { x: 98, y: 360, maxWidth: 340, anchor: "start" },
  },
  "cafe-2": {
    title: { x: 98, y: 180, maxWidth: 820, anchor: "start" },
    subtitle: { x: 98, y: 316, maxWidth: 760, anchor: "start" },
  },
  "cafe-3": {
    title: { x: W / 2, y: 180, maxWidth: 920, anchor: "middle" },
    subtitle: { x: W / 2, y: 316, maxWidth: 760, anchor: "middle" },
  },
  "cafe-4": {
    title: { x: 1760, y: 180, maxWidth: 720, anchor: "end" },
    subtitle: { x: 1760, y: 316, maxWidth: 620, anchor: "end" },
  },
  "cafe-5": {
    title: { x: 98, y: 232, maxWidth: 360, anchor: "start", maxLines: 3 },
    subtitle: { x: 98, y: 360, maxWidth: 340, anchor: "start" },
  },
  "announcement-1": {
    title: { x: W / 2, y: 390, maxWidth: 1100, anchor: "middle" },
    subtitle: { x: W / 2, y: 520, maxWidth: 820, anchor: "middle" },
  },
  "announcement-4": {
    title: { x: W / 2, y: 180, maxWidth: 980, anchor: "middle" },
    subtitle: { x: W / 2, y: 316, maxWidth: 820, anchor: "middle" },
  },
  "thank-you-1": {
    title: { x: W / 2, y: 390, maxWidth: 1040, anchor: "middle" },
    subtitle: { x: W / 2, y: 520, maxWidth: 760, anchor: "middle" },
  },
  "thank-you-2": {
    title: { x: W / 2, y: 360, maxWidth: 1180, anchor: "middle" },
    subtitle: { x: W / 2, y: 500, maxWidth: 760, anchor: "middle" },
  },
};

const PHOTO_AREAS: Record<FrameStyleId, PhotoArea | null> = {
  "hackathon-1": { x: 590, y: 170, width: 1240, height: 765 },
  "hackathon-2": { x: 90, y: 380, width: 1740, height: 555 },
  "hackathon-3": { x: 90, y: 380, width: 1740, height: 555 },
  "hackathon-4": { x: 90, y: 345, width: 1740, height: 590 },
  "hackathon-5": { x: 90, y: 380, width: 1740, height: 555 },
  "meetup-1": { x: 90, y: 380, width: 1740, height: 555 },
  "meetup-2": { x: 90, y: 380, width: 1740, height: 555 },
  "meetup-3": { x: 90, y: 380, width: 1740, height: 555 },
  "meetup-4": { x: 90, y: 380, width: 1740, height: 555 },
  "meetup-5": { x: 90, y: 390, width: 1740, height: 545 },
  "cafe-1": { x: 590, y: 170, width: 1240, height: 765 },
  "cafe-2": { x: 90, y: 380, width: 1740, height: 555 },
  "cafe-3": { x: 90, y: 380, width: 1740, height: 555 },
  "cafe-4": { x: 90, y: 380, width: 1740, height: 555 },
  "cafe-5": { x: 590, y: 170, width: 1240, height: 765 },
  "announcement-1": null,
  "announcement-4": { x: 90, y: 400, width: 1740, height: 535 },
  "thank-you-1": null,
  "thank-you-2": null,
};

const TEMPLATES: FrameTemplate[] = [
  {
    id: "hackathon-1",
    name: "Hackathon Build",
    eventKind: "hackathon",
    layout: "hero",
    decor: "grid",
    title: "HACKATHON",
    subtitle: "Build fast. Ship smarter. With Cursor.",
    slot: PHOTO_AREAS["hackathon-1"],
    tags: ["hackathon", "build", "cursor"],
    description: "Bold text-forward hackathon frame with fixed Cursor layout.",
  },
  {
    id: "hackathon-2",
    name: "Hackathon Code",
    eventKind: "hackathon",
    layout: "angled",
    decor: "cube",
    title: "HACKATHON",
    subtitle: "Code. Create. Collaborate.",
    slot: PHOTO_AREAS["hackathon-2"],
    tags: ["hackathon", "code", "team"],
    description: "Hackathon frame with large angled photo area.",
  },
  {
    id: "hackathon-3",
    name: "Hackathon Impact",
    eventKind: "hackathon",
    layout: "wide",
    decor: "dots",
    title: "HACKATHON",
    subtitle: "Turning ideas into impact",
    slot: PHOTO_AREAS["hackathon-3"],
    tags: ["hackathon", "ideas", "impact"],
    description: "Hackathon frame with dotted lower-right energy.",
  },
  {
    id: "hackathon-4",
    name: "Hackathon Ship",
    eventKind: "hackathon",
    layout: "bracket",
    decor: "dots",
    title: "HACKATHON",
    subtitle: "Build · Innovate · Ship",
    slot: PHOTO_AREAS["hackathon-4"],
    tags: ["hackathon", "ship", "launch"],
    description: "Centered hackathon frame with fixed bracket title lockup.",
  },
  {
    id: "hackathon-5",
    name: "Hackathon Start",
    eventKind: "hackathon",
    layout: "minimal",
    decor: "minimal",
    title: "HACKATHON",
    subtitle: "Good ideas start here. Great products ship here.",
    slot: PHOTO_AREAS["hackathon-5"],
    tags: ["hackathon", "product", "ideas"],
    description: "Minimal hackathon frame with clean central photo slot.",
  },
  {
    id: "meetup-1",
    name: "Meetup Connect",
    eventKind: "meetup",
    layout: "angled",
    decor: "chat",
    title: "MEETUP",
    subtitle: "Learn. Connect. Build.",
    slot: PHOTO_AREAS["meetup-1"],
    tags: ["meetup", "community", "network"],
    description: "Meetup frame with fixed chat and people accents.",
  },
  {
    id: "meetup-2",
    name: "Meetup Projects",
    eventKind: "meetup",
    layout: "wide",
    decor: "waves",
    title: "MEETUP",
    subtitle: "Real people. Real projects. Real impact.",
    slot: PHOTO_AREAS["meetup-2"],
    tags: ["meetup", "projects", "community"],
    description: "Meetup frame with flowing wave detail.",
  },
  {
    id: "meetup-3",
    name: "Meetup Grow",
    eventKind: "meetup",
    layout: "wide",
    decor: "city",
    title: "MEETUP",
    subtitle: "Code together. Grow together.",
    slot: PHOTO_AREAS["meetup-3"],
    tags: ["meetup", "code", "growth"],
    description: "Meetup frame with fixed skyline accent.",
  },
  {
    id: "meetup-4",
    name: "Meetup Ideas",
    eventKind: "meetup",
    layout: "wide",
    decor: "chat",
    title: "MEETUP",
    subtitle: "Share ideas. Get inspired.",
    slot: PHOTO_AREAS["meetup-4"],
    tags: ["meetup", "ideas", "inspire"],
    description: "Meetup frame with chat icon and dot field.",
  },
  {
    id: "meetup-5",
    name: "Meetup Future",
    eventKind: "meetup",
    layout: "angled",
    decor: "waves",
    title: "MEETUP",
    subtitle: "Building the future, one meetup at a time.",
    slot: PHOTO_AREAS["meetup-5"],
    tags: ["meetup", "future", "community"],
    description: "Meetup frame with fixed waves and lower hashtag.",
  },
  {
    id: "cafe-1",
    name: "Cafe Community",
    eventKind: "cafe",
    layout: "minimal",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Code. Coffee. Community.",
    slot: PHOTO_AREAS["cafe-1"],
    tags: ["cafe", "coffee", "community"],
    description: "Cafe Cursor frame with right photo card and cup icon.",
  },
  {
    id: "cafe-2",
    name: "Cafe Conversations",
    eventKind: "cafe",
    layout: "angled",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Good conversations. Better code.",
    slot: PHOTO_AREAS["cafe-2"],
    tags: ["cafe", "conversations", "code"],
    description: "Cafe Cursor frame with coffee beans and wide photo slot.",
  },
  {
    id: "cafe-3",
    name: "Cafe Ship Code",
    eventKind: "cafe",
    layout: "wide",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Sip coffee. Ship code.",
    slot: PHOTO_AREAS["cafe-3"],
    tags: ["cafe", "ship", "code"],
    description: "Cafe Cursor frame with fixed cup accent.",
  },
  {
    id: "cafe-4",
    name: "Cafe Builders",
    eventKind: "cafe",
    layout: "wide",
    decor: "minimal",
    title: "CAFE CURSOR",
    subtitle: "Where builders meet over coffee",
    slot: PHOTO_AREAS["cafe-4"],
    tags: ["cafe", "builders", "coffee"],
    description: "Cafe Cursor frame with hanging light detail.",
  },
  {
    id: "cafe-5",
    name: "Cafe Connections",
    eventKind: "cafe",
    layout: "minimal",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Ideas brew here. Connections grow here.",
    slot: PHOTO_AREAS["cafe-5"],
    tags: ["cafe", "ideas", "connections"],
    description: "Cafe Cursor frame with right card and cup illustration.",
  },
  {
    id: "announcement-1",
    name: "Announcement Text",
    eventKind: "announcement",
    layout: "minimal",
    decor: "megaphone",
    title: "ANNOUNCEMENT",
    subtitle: "Big things are coming. Stay tuned!",
    slot: PHOTO_AREAS["announcement-1"],
    tags: ["announcement", "launch", "news"],
    description: "Centered text-only Cursor announcement frame.",
  },
  {
    id: "announcement-4",
    name: "Announcement Photo",
    eventKind: "announcement",
    layout: "wide",
    decor: "minimal",
    title: "ANNOUNCEMENT",
    subtitle: "Get ready to build, learn & connect.",
    slot: PHOTO_AREAS["announcement-4"],
    tags: ["announcement", "build", "connect"],
    description: "Photo-led Cursor announcement frame.",
  },
  {
    id: "thank-you-1",
    name: "Thank You Classic",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "heart",
    title: "THANK YOU!",
    subtitle: "Thanks to everyone who joined and made it amazing.",
    slot: PHOTO_AREAS["thank-you-1"],
    tags: ["thank-you", "community", "recap"],
    description: "Clean text-only Cursor thank-you frame.",
  },
  {
    id: "thank-you-2",
    name: "Thank You Centered",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "waves",
    title: "THANK YOU!",
    subtitle: "Grateful for the energy, ideas and connections.",
    slot: PHOTO_AREAS["thank-you-2"],
    tags: ["thank-you", "gratitude", "community"],
    description: "Centered text-only Cursor thank-you frame.",
  },
];

function enc(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function x(v: string | undefined, fallback = ""): string {
  return (v ?? fallback)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(value: string, maxWidth: number, fontSize: number, maxLines = 3): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const maxChars = Math.max(8, Math.floor(maxWidth / (fontSize * 0.68)));
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\.+$/, "")}...`;
  }

  return lines;
}

function multilineText({
  value,
  x0,
  y,
  maxWidth,
  fontSize,
  weight,
  fill,
  letterSpacing = 0,
  anchor = "start",
  maxLines = 3,
}: {
  value: string;
  x0: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  weight: number;
  fill: string;
  letterSpacing?: number;
  anchor?: "start" | "middle" | "end";
  maxLines?: number;
}): string {
  const lines = wrapText(value, maxWidth, fontSize, maxLines);
  const lineHeight = fontSize * 1.18;
  const tspans = lines
    .map((line, index) => `<tspan x="${x0}" dy="${index === 0 ? 0 : lineHeight}">${x(line)}</tspan>`)
    .join("");
  const anchorAttr = anchor === "start" ? "" : ` text-anchor="${anchor}"`;
  const spacingAttr = letterSpacing ? ` letter-spacing="${letterSpacing}"` : "";
  return `<text x="${x0}" y="${y}"${anchorAttr} font-family="${FONT_FAMILY}" font-size="${fontSize}" font-weight="${weight}"${spacingAttr} fill="${fill}">${tspans}</text>`;
}

function contentTitle(b: BrandingConfig, fallback: string): string {
  const value = b.eventName.trim();
  if (!value) return fallback;
  return value.replace(/^\//, "");
}

function contentSubtitle(b: BrandingConfig, fallback: string): string {
  const value = b.tagline.trim();
  if (!value) return fallback;
  return value;
}

function resolveTextLayout(t: FrameTemplate, title: string): ResolvedTextLayout {
  const isTextOnly = !t.slot;
  const isAnnouncement = t.eventKind === "announcement";
  const isBracket = t.layout === "bracket";
  const staticLayout = TEXT_LAYOUTS[t.id];

  if (isTextOnly) {
    const titleLayer = staticLayout.title;
    const titleMaxLines = titleLayer.maxLines ?? 2;
    const subtitleLayer = staticLayout.subtitle ?? {
      x: titleLayer.x,
      y: titleLayer.y + TEXT_ONLY_TITLE_FONT_SIZE * 1.18 + 34,
      maxWidth: titleLayer.maxWidth,
      anchor: titleLayer.anchor,
    };
    const titleFontSize = TEXT_ONLY_TITLE_FONT_SIZE;
    const titleLines = wrapText(title.toUpperCase(), titleLayer.maxWidth, titleFontSize, titleMaxLines);
    const subtitleY = Math.max(subtitleLayer.y, titleLayer.y + titleLines.length * titleFontSize * 1.18 + 30);

    return {
      title: {
        x: titleLayer.x,
        y: titleLayer.y,
        maxWidth: titleLayer.maxWidth,
        fontSize: titleFontSize,
        anchor: titleLayer.anchor,
        maxLines: titleMaxLines,
      },
      subtitle: {
        x: subtitleLayer.x,
        y: subtitleY,
        maxWidth: subtitleLayer.maxWidth,
        fontSize: SUBTITLE_FONT_SIZE,
        anchor: subtitleLayer.anchor,
        maxLines: 3,
      },
    };
  }

  if (isBracket) {
    const titleLayer = staticLayout.title;
    const titleMaxLines = titleLayer.maxLines ?? 2;
    const subtitleLayer = staticLayout.subtitle ?? {
      x: titleLayer.x,
      y: titleLayer.y + 68,
      maxWidth: 560,
      anchor: titleLayer.anchor,
    };
    return {
      title: {
        x: titleLayer.x,
        y: titleLayer.y,
        maxWidth: titleLayer.maxWidth,
        fontSize: TITLE_FONT_SIZE,
        anchor: titleLayer.anchor,
        maxLines: titleMaxLines,
      },
      subtitle: {
        x: subtitleLayer.x,
        y: subtitleLayer.y,
        maxWidth: subtitleLayer.maxWidth,
        fontSize: SUBTITLE_FONT_SIZE,
        anchor: subtitleLayer.anchor,
        maxLines: 3,
      },
    };
  }

  const titleLayer = staticLayout.title;
  const titleMaxLines = titleLayer.maxLines ?? 2;
  const subtitleLayer = staticLayout.subtitle ?? {
    x: titleLayer.x,
    y: titleLayer.y + TITLE_FONT_SIZE * 1.18 + SUBTITLE_FONT_SIZE + 16,
    maxWidth: titleLayer.maxWidth,
    anchor: titleLayer.anchor,
  };
  const titleFontSize = TITLE_FONT_SIZE;
  const titleLines = wrapText(title.toUpperCase(), titleLayer.maxWidth, titleFontSize, titleMaxLines);
  const subtitleY = Math.max(
    subtitleLayer.y,
    titleLayer.y + titleLines.length * titleFontSize * 1.18 + 16,
  );

  return {
    title: {
      x: titleLayer.x,
      y: titleLayer.y,
      maxWidth: titleLayer.maxWidth,
      fontSize: titleFontSize,
      anchor: titleLayer.anchor,
      maxLines: titleMaxLines,
    },
    subtitle: {
      x: subtitleLayer.x,
      y: subtitleY,
      maxWidth: subtitleLayer.maxWidth,
      fontSize: SUBTITLE_FONT_SIZE,
      anchor: subtitleLayer.anchor,
      maxLines: 3,
    },
  };
}

function bgColor(): string {
  return "#050505";
}

function secondaryColor(): string {
  return "#111827";
}

function panelBg(area: PhotoArea | null, fill: string): string {
  if (!area) return `<rect x="0" y="0" width="${W}" height="${H}" fill="${fill}"/>`;
  const { x: ax, y: ay, width: aw, height: ah } = area;
  return `<rect x="0" y="0" width="${W}" height="${ay}" fill="${fill}"/>
  <rect x="0" y="${ay}" width="${ax}" height="${ah}" fill="${fill}"/>
  <rect x="${ax + aw}" y="${ay}" width="${W - ax - aw}" height="${ah}" fill="${fill}"/>
  <rect x="0" y="${ay + ah}" width="${W}" height="${H - ay - ah}" fill="${fill}"/>`;
}

function logo(): string {
  return cursorLogoSvg(LOGO_X, LOGO_Y, LOGO_HEIGHT, { anchor: "top-left", opacity: 0.96 });
}

function slotBorder(area: PhotoArea | null, layout: LayoutKind): string {
  if (!area) return "";
  const cut = layout === "angled" ? `L${area.x + area.width - 120},${area.y + area.height} L${area.x},${area.y + area.height}` : `L${area.x},${area.y + area.height}`;
  const path = layout === "angled"
    ? `M${area.x},${area.y} L${area.x + area.width - 70},${area.y} L${area.x + area.width},${area.y + 70} ${cut} Z`
    : `M${area.x},${area.y} L${area.x + area.width},${area.y} L${area.x + area.width},${area.y + area.height} ${cut} Z`;
  return `<path d="${path}" fill="none" stroke="rgba(255,255,255,0.86)" stroke-width="2.4" vector-effect="non-scaling-stroke"/>`;
}

function bracketTitle(title: string, layout: ResolvedTextLayer): string {
  const size = layout.fontSize;
  const isLong = title.length > 22;
  const estimatedWidth = Math.min(layout.maxWidth, title.length * size * 0.64);
  const braceOffset = estimatedWidth / 2 + 70;
  const braceSize = Math.max(74, Math.round(size * 1.45));
  const titleText = `<text x="${layout.x}" y="${layout.y}" text-anchor="middle" font-family="${FONT_FAMILY}" font-size="${size}" font-weight="${TITLE_WEIGHT}" letter-spacing="4" fill="white">${x(title).toUpperCase()}</text>`;

  if (isLong || braceOffset > 680) return titleText;

  return `<text x="${layout.x - braceOffset}" y="${layout.y + 2}" text-anchor="middle" font-family="${FONT_FAMILY}" font-size="${braceSize}" font-weight="${SUBTITLE_WEIGHT}" fill="rgba(255,255,255,0.88)">{</text>
  ${titleText}
  <text x="${layout.x + braceOffset}" y="${layout.y + 2}" text-anchor="middle" font-family="${FONT_FAMILY}" font-size="${braceSize}" font-weight="${SUBTITLE_WEIGHT}" fill="rgba(255,255,255,0.88)">}</text>`;
}

function textOnlyDesign(t: FrameTemplate, title: string, subtitle: string, layout: ResolvedTextLayout): string {
  const isAnnouncement = t.eventKind === "announcement";
  if (isAnnouncement) {
    const boxW = 1240;
    const boxY = 260;
    return `<rect x="${(W - boxW) / 2}" y="${boxY}" width="${boxW}" height="430" rx="46" fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <rect x="${(W - boxW) / 2 + 130}" y="${boxY + 320}" width="${boxW - 260}" height="2" fill="rgba(255,255,255,0.16)"/>
    ${multilineText({ value: title.toUpperCase(), x0: layout.title.x, y: layout.title.y, maxWidth: layout.title.maxWidth, fontSize: layout.title.fontSize, weight: TITLE_WEIGHT, letterSpacing: 4, fill: "white", anchor: layout.title.anchor, maxLines: layout.title.maxLines })}
    ${multilineText({ value: subtitle, x0: layout.subtitle.x, y: layout.subtitle.y, maxWidth: layout.subtitle.maxWidth, fontSize: layout.subtitle.fontSize, weight: SUBTITLE_WEIGHT, fill: "rgba(255,255,255,0.78)", anchor: layout.subtitle.anchor, maxLines: layout.subtitle.maxLines })}`;
  }

  const bigTitle = multilineText({
    value: title.toUpperCase(),
    x0: layout.title.x,
    y: layout.title.y,
    maxWidth: layout.title.maxWidth,
    fontSize: layout.title.fontSize,
    weight: TITLE_WEIGHT,
    letterSpacing: 4,
    fill: "white",
    anchor: layout.title.anchor,
    maxLines: layout.title.maxLines,
  });
  const body = multilineText({
    value: subtitle,
    x0: layout.subtitle.x,
    y: layout.subtitle.y,
    maxWidth: layout.subtitle.maxWidth,
    fontSize: layout.subtitle.fontSize,
    weight: SUBTITLE_WEIGHT,
    fill: "rgba(255,255,255,0.78)",
    anchor: layout.subtitle.anchor,
    maxLines: layout.subtitle.maxLines,
  });

  switch (t.id) {
    case "thank-you-1":
      return `<rect x="330" y="250" width="1260" height="455" rx="48" fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <rect x="540" y="610" width="840" height="2" fill="rgba(255,255,255,0.16)"/>
      ${bigTitle}${body}`;
    case "thank-you-2":
      return `${bigTitle}${body}
      <rect x="500" y="690" width="920" height="2" fill="rgba(255,255,255,0.18)"/>`;
    default:
      return `${bigTitle}${body}`;
  }
}

function renderTemplate(t: FrameTemplate, b: BrandingConfig): string {
  const bg = bgColor();
  const sec = secondaryColor();
  const title = contentTitle(b, t.title);
  const subtitle = contentSubtitle(b, t.subtitle);
  const isBracket = t.layout === "bracket";
  const isTextOnly = !t.slot;
  const textLayout = resolveTextLayout(t, title);

  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="72%" cy="20%" r="72%">
      <stop offset="0%" stop-color="${sec}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.16"/>
    </linearGradient>
  </defs>
  ${panelBg(t.slot, bg)}
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#glow)" opacity="0.35"/>
  ${logo()}
  ${slotBorder(t.slot, t.layout)}
  ${isTextOnly ? textOnlyDesign(t, title, subtitle, textLayout) : isBracket ? bracketTitle(title, textLayout.title) : `
  ${multilineText({ value: title.toUpperCase(), x0: textLayout.title.x, y: textLayout.title.y, maxWidth: textLayout.title.maxWidth, fontSize: textLayout.title.fontSize, weight: TITLE_WEIGHT, letterSpacing: 4, fill: "white", anchor: textLayout.title.anchor, maxLines: textLayout.title.maxLines })}`}
  ${isTextOnly ? "" : isBracket
    ? multilineText({ value: subtitle, x0: textLayout.subtitle.x, y: textLayout.subtitle.y, maxWidth: textLayout.subtitle.maxWidth, fontSize: textLayout.subtitle.fontSize, weight: SUBTITLE_WEIGHT, fill: "rgba(255,255,255,0.82)", anchor: textLayout.subtitle.anchor, maxLines: textLayout.subtitle.maxLines })
    : multilineText({ value: subtitle, x0: textLayout.subtitle.x, y: textLayout.subtitle.y, maxWidth: textLayout.subtitle.maxWidth, fontSize: textLayout.subtitle.fontSize, weight: SUBTITLE_WEIGHT, fill: "rgba(255,255,255,0.82)", anchor: textLayout.subtitle.anchor, maxLines: textLayout.subtitle.maxLines })}
</svg>`);
}

type FrameGenerator = (b: BrandingConfig) => string;

const GENERATORS = Object.fromEntries(
  TEMPLATES.map((template) => [template.id, (branding: BrandingConfig) => renderTemplate(template, branding)])
) as Record<FrameStyleId, FrameGenerator>;

export function getFramePhotoArea(styleId: FrameStyleId): PhotoArea | null {
  return PHOTO_AREAS[styleId];
}

export function generateFrameImage(
  styleId: FrameStyleId,
  branding: BrandingConfig
): string {
  return GENERATORS[styleId](branding);
}

export function buildPresetFrames(
  branding: BrandingConfig = DEFAULT_BRANDING
): Frame[] {
  return TEMPLATES.map((template) => ({
    id: `preset-${template.id}`,
    name: template.name,
    event: template.title,
    imageUrl: renderTemplate(template, branding),
    category: "preset",
    aspectRatio: "16:9",
    createdAt: "2026-01-01T00:00:00.000Z",
    description: template.description,
    tags: template.tags,
    color: "#ffffff",
    styleId: template.id,
    photoArea: template.slot,
  }));
}

export const FRAME_COLORS = [
  "#050505", "#09090c", "#111111",
  "#1a1a24", "#242424", "#2a1f44",
  "#4d9ef6", "#a78bfa", "#2563eb",
  "#7c3aed", "#059669", "#e11d48",
];
