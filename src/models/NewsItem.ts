export type NewsCategory =
  | "Event"
  | "Growth"
  | "Inflation"
  | "Labor"
  | "Debt"
  | "BusinessCycle"
  | "Election";

export interface NewsItem {
  year: number;
  quarter: number;

  title: string;
  description: string;

  category: NewsCategory;
}