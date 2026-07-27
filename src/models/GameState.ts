export interface GameState {
  // Time
  quarter: number;

  // Economy
  gdp: number;
  inflation: number;
  unemployment: number;
  debt: number;

  // Treasury
  revenue: number;
  expenses: number;
  budgetBalance: number;
  interestPayments: number;
  debtToGdp: number;

  approval: number;

  // Fiscal Policy
  incomeTax: number;
  educationSpending: number;
  healthcareSpending: number;
  defenseSpending: number;
  infrastructureSpending: number;
  scienceSpending: number;

  // Monetary Policy
  interestRate: number;
}