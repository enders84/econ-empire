export interface HistoryPoint {
  year: number;
  quarter: number;

  gdp: number;
  gdpGrowth: number;
  potentialGdp: number;
  outputGap: number;

  inflation: number;
  unemployment: number;

  debt: number;
  debtToGdp: number;

  approval: number;
}