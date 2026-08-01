export interface QuarterlyReport {
  year: number;
  quarter: number;

  gdpChange: number;
  inflationChange: number;
  unemploymentChange: number;
  approvalChange: number;

  budgetBalance: number;
  debtToGdp: number;

  summary: string[];
}