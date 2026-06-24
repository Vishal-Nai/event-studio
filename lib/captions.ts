import { BrandingConfig, Caption, DEFAULT_BRANDING } from "@/types";

function cleanEventName(value: string): string {
  const eventName = value.trim().replace(/^\//, "");
  return eventName || DEFAULT_BRANDING.eventName;
}

function parseHashtags(value?: string): string[] {
  const tags = (value || DEFAULT_BRANDING.hashtags || "")
    .split(/[,\s]+/)
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
  return Array.from(new Set(tags)).slice(0, 8);
}

function eventType(eventName: string): string {
  const lower = eventName.toLowerCase();
  if (lower.includes("hackathon")) return "hackathon";
  if (lower.includes("meetup")) return "meetup";
  if (lower.includes("cafe")) return "community meetup";
  if (lower.includes("announcement")) return "announcement";
  if (lower.includes("thank")) return "thank-you note";
  return "event";
}

export function generateCaptions(details: Pick<BrandingConfig, "eventName" | "tagline" | "date" | "location" | "hashtags">): Caption[] {
  const eventName = cleanEventName(details.eventName);
  const tagline = details.tagline?.trim();
  const location = details.location?.trim() || "India";
  const date = details.date?.trim();
  const type = eventType(eventName);
  const whenWhere = [date, location].filter(Boolean).join(" · ");
  const hashtags = parseHashtags(details.hashtags);

  return [
    {
      text: `Excited to be part of ${eventName}${whenWhere ? ` (${whenWhere})` : ""}. ${tagline || "Building, learning, and connecting with the Cursor community."}`,
      hashtags,
    },
    {
      text: `${eventName} brought builders, ideas, and AI-powered workflows together${location ? ` in ${location}` : ""}. Grateful for the energy, conversations, and community.`,
      hashtags,
    },
    {
      text: `A memorable ${type} with the Cursor community. ${tagline || "Great conversations, practical demos, and lots of inspiration to keep building."}`,
      hashtags,
    },
  ];
}

export function formatCaptionForShare(caption: Caption): string {
  const hashtagString = caption.hashtags.map((t) => `#${t}`).join(" ");
  return `${caption.text}\n\n${hashtagString}`;
}
