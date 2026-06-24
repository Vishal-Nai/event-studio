import { Caption } from "@/types";

interface CaptionTemplate {
  event: string;
  keyword: string;
  templates: string[];
  hashtags: string[];
}

const CAPTION_TEMPLATES: CaptionTemplate[] = [
  {
    event: "Cursor Hackathon Dubai",
    keyword: "hackathon",
    templates: [
      "Proud to be part of {event}! Building the future with AI-powered tools. The energy here is incredible — so many brilliant minds, one mission: ship faster. 🚀",
      "Just wrapped an epic session at {event}! Connecting with the brightest builders in the region. The future of software development is being written right here. ✨",
      "Representing at {event} in Dubai! What an honor to be part of this community of creators and innovators pushing the boundaries of AI-assisted development. 💡",
    ],
    hashtags: ["CursorHackathon", "Dubai", "AI", "BuildWithCursor", "Hackathon2026", "TechDubai"],
  },
  {
    event: "Cursor Meetup Mumbai",
    keyword: "meetup",
    templates: [
      "Had an amazing time at {event}! Mumbai's tech scene is electric ⚡ — connecting with developers who are reshaping the future with AI-first workflows.",
      "Representing India's developer community at {event}! The conversations, the demos, the energy — Mumbai never disappoints. Keep building! 🇮🇳",
      "Just attended {event} and my mind is blown. AI-native development is transforming how we build products. So proud of this community! 🙌",
    ],
    hashtags: ["CursorMeetup", "Mumbai", "TechMumbai", "IndiaAI", "DeveloperCommunity", "BuildWithAI"],
  },
  {
    event: "AI Builders Night",
    keyword: "ai",
    templates: [
      "Late nights, big ideas. Attended {event} and left inspired to build something incredible. The AI revolution isn't coming — it's already here. 🤖",
      "Shipped more in one evening at {event} than I thought possible. AI-native workflows are a game changer. Who else is building tonight? 🌙",
      "Proud to call myself an AI builder after {event}! Met incredible people who are using tools like Cursor to 10x their productivity. The future is now. ⚡",
    ],
    hashtags: ["AIBuilders", "BuildWithAI", "ArtificialIntelligence", "Cursor", "NightBuilds", "Indie"],
  },
  {
    event: "Tech Summit 2026",
    keyword: "summit",
    templates: [
      "Honored to attend {event} as an official delegate. The conversations about AI, developer tooling, and the future of software were truly eye-opening. 🌟",
      "Just got back from {event} and I'm buzzing with inspiration. The future of technology is brighter than ever. So grateful to be part of this journey. 🏆",
      "Representing at {event}! Three days of incredible talks, workshops, and networking with the best minds in tech. The future of software is being built right now. 💎",
    ],
    hashtags: ["TechSummit2026", "TechConference", "FutureOfTech", "Innovation", "AI2026"],
  },
  {
    event: "Dev Fest 2026",
    keyword: "devfest",
    templates: [
      "Dev Fest 2026 was absolutely incredible! 🎉 Celebrating the amazing developer community and the power of building together. Code · Connect · Celebrate!",
      "Had the time of my life at {event}! The energy, the people, the demos — everything was top-notch. This is why I love being a developer. 🚀✨",
      "Attended {event} and left with a full notebook of ideas and a heart full of inspiration. The developer community is the best community. 🎊",
    ],
    hashtags: ["DevFest2026", "DevFest", "DeveloperFestival", "CommunityBuilding", "OpenSource"],
  },
];

const DEFAULT_TEMPLATES = [
  "Just attended an amazing tech event and connecting with brilliant minds! The future of AI-powered development is unfolding right before our eyes. 🚀",
  "Grateful to be part of the global developer community! Every event, every conversation, every line of code brings us closer to the future we're building together. ✨",
  "Technology is better when we build it together! So inspired after this incredible event. Keep shipping, keep learning, keep connecting. 💡",
];

const DEFAULT_HASHTAGS = ["Tech", "AI", "Developer", "Community", "Innovation", "BuildInPublic"];

function findTemplate(eventName: string): CaptionTemplate | null {
  if (!eventName) return null;
  const lower = eventName.toLowerCase();
  return (
    CAPTION_TEMPLATES.find((t) =>
      lower.includes(t.keyword) || lower.includes(t.event.toLowerCase())
    ) ?? null
  );
}

export function generateCaptions(eventName: string): Caption[] {
  const template = findTemplate(eventName);

  if (template) {
    return template.templates.map((text) => ({
      text: text.replace(/{event}/g, template.event),
      hashtags: template.hashtags,
    }));
  }

  return DEFAULT_TEMPLATES.map((text) => ({
    text,
    hashtags: DEFAULT_HASHTAGS,
  }));
}

export function formatCaptionForShare(caption: Caption): string {
  const hashtagString = caption.hashtags.map((t) => `#${t}`).join(" ");
  return `${caption.text}\n\n${hashtagString}`;
}
