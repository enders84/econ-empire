export interface GameState {
  // Time
  quarter: number;

  // Economy
  gdp: number;
  inflation: number;
  unemployment: number;
  debt: number;
  approval: number;

  // Player Policies
  incomeTax: number;
  governmentSpending: number;
  interestRate: number;
}