import { marineWebglOrigin } from "./approved-origins.mjs";

export const categories = ["ecosystems", "tools", "media"] as const;
export const statuses = ["concept", "development", "live", "paused", "archived"] as const;

export type Experiment = {
  id: string;
  slug: string;
  category: (typeof categories)[number];
  tags: string[];
  author: { type: "team" | "guest"; name: string; url?: string };
  status: (typeof statuses)[number];
  approved: boolean;
  cover: `/${string}`;
  launch: { type: "iframe" | "external"; url?: string; fullscreen: boolean }
    | { type: "internal"; component: string; fullscreen: boolean };
};

export type ExperimentMaterial = {
  title: string;
  description: string;
  goal: string;
  publications?: { label: string; publicationSlug: string }[];
  observations?: { date: string; text: string }[];
};

export const experiments: Experiment[] = [
  {
    id: "marine-ecosystem",
    slug: "marine-ecosystem",
    category: "ecosystems",
    tags: ["Unity", "WebGL"],
    author: { type: "team", name: "NextAIism", url: "https://nextaiism-web.vercel.app" },
    status: "development",
    approved: true,
    cover: "/experiments/marine-ecosystem.webp",
    launch: { type: "iframe", url: process.env.MARINE_ECOSYSTEM_WEBGL_URL ?? marineWebglOrigin, fullscreen: true },
  },
];
