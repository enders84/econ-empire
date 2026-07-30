export interface HistoryPoint {
  year: number;
  quarter: number;

  gdp: number;
  inflation: number;
  unemployment: number;

  debt: number;
  debtToGdp: number;

  approval: number;
}