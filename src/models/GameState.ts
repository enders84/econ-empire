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
  educationSpending: number;
healthcareSpending: number;
defenseSpending: number;
infrastructureSpending: number;
scienceSpending: number;
  interestRate: number;
}