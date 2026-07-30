import type { HistoryPoint } from "./History";

export interface EconomyState {
  gdp: number;
  potentialGdp: number;
  outputGap: number;
  productivity: number;

  consumption: number;
  investment: number;
  governmentSpending: number;
  exports: number;
  imports: number;

  inflation: number;
  unemployment: number;
  interestRate: number;
}

export interface TreasuryState {
  revenue: number;
  expenses: number;
  budgetBalance: number;

  debt: number;
  debtToGdp: number;
  interestPayments: number;

  incomeTax: number;

  educationSpending: number;
  healthcareSpending: number;
  defenseSpending: number;
  infrastructureSpending: number;
  scienceSpending: number;
}

export interface PoliticalState {
  approval: number;
  electionYear: number;
  currentYear: number;
}

export interface GameState {
  quarter: number;
  economy: EconomyState;
  treasury: TreasuryState;
  politics: PoliticalState;
  history: HistoryPoint[];
}

export type { HistoryPoint } from "./History";