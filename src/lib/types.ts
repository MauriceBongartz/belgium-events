export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  created_at: string;
}

export const CATEGORIES = [
  "Music",
  "Art",
  "Food & Drink",
  "Sports",
  "Culture",
  "Technology",
  "Festival",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
