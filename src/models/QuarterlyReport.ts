export interface QuarterlyReport {
  year: number;
  quarter: number;

  gdpChange: number;
  inflationChange: number;
  unemploymentChange: number;
  approvalChange: number;

  budgetBalance: number;
  debtToGdp: number;

  businessCycle:
    | "Expansion"
    | "Boom"
    | "Slowdown"
    | "Recession"
    | "Recovery";

  summary: string[];

  eventTitle?: string;
  eventDescription?: string;
}