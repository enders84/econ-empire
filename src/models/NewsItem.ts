export type NewsCategory =
  | "Event"
  | "Growth"
  | "Inflation"
  | "Labor"
  | "Debt"
  | "BusinessCycle";

export interface NewsItem {
  year: number;
  quarter: number;

  title: string;
  description: string;

  category: NewsCategory;
}