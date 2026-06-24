import type { CustomFrameConfig } from "@/lib/custom-frame";

export interface Frame {
  id: string;
  name: string;
  event: string;
  imageUrl: string;
  category: "preset" | "custom";
  aspectRatio: "1:1" | "4:5" | "16:9";
  createdAt: string;
  description?: string;
  tags?: string[];
  color?: string;
  styleId?: FrameStyleId;
  branding?: BrandingConfig;
  photoArea?: PhotoArea | null;
  customConfig?: CustomFrameConfig;
}

export interface EditorTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Caption {
  text: string;
  hashtags: string[];
}


export type AspectRatio = "1:1" | "4:5" | "16:9";

export interface PhotoArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
  "16:9": { width: 1920, height: 1080 },
};

// ─── Branding Config ────────────────────────────────────────────────────────

export interface BrandingConfig {
  eventName: string;
  tagline: string;
  logoText: string;
  date: string;
  location: string;
  accentColor: string;
  secondaryColor: string;
  website: string;
  statusText?: string;
  hashtags?: string;
  backgroundStyle?: "city" | "grid" | "minimal" | "code";
}

export const DEFAULT_BRANDING: BrandingConfig = {
  eventName: "/Dubai Meetup",
  tagline: "AI coding agent for building ambitious software",
  logoText: "Cursor",
  date: "July 2026",
  location: "Dubai, UAE",
  accentColor: "#09090c",
  secondaryColor: "#1e1e2e",
  website: "cursor.com",
  statusText: "I'm Attending",
  hashtags: "#CursorAI, #DevCommunity, #TechMeetup, #buildinpublic, #aicoding, #AgentsDevelopment",
  backgroundStyle: "city",
};

export const FRAME_STYLE_IDS = [
  "minimal-bottom",
  "bold-brand",
  "corner-badge",
  "gradient-fade",
  "classic-border",
] as const;

export type FrameStyleId = typeof FRAME_STYLE_IDS[number];

export interface FrameStyle {
  id: FrameStyleId;
  name: string;
  description: string;
}

export const FRAME_STYLES: FrameStyle[] = [
  { id: "minimal-bottom",  name: "Attendee Portrait", description: "Clean portrait style for attendee photos and community posts." },
  { id: "bold-brand",      name: "Hero Photo",        description: "Full-photo social post with premium gradient text overlay." },
  { id: "corner-badge",    name: "Announcement",      description: "Professional no-photo event announcement card." },
  { id: "gradient-fade",   name: "Speaker Spotlight", description: "Editorial side-panel style for speakers and featured guests." },
  { id: "classic-border",  name: "Event Recap",       description: "Polished post-event style with large photo and clean recap panel." },
];
