import type { GameState } from "../models/GameState";

export interface BudgetResult {
  revenue: number;
  expenses: number;
  budgetBalance: number;
  interestPayments: number;
  debtToGdp: number;
}

export function calculateBudget(
  economy: GameState
): BudgetResult {

  // Government revenue from income tax
  const revenue =
    economy.gdp * (economy.incomeTax / 100);

  // Total government spending
  const expenses =
      economy.educationSpending
    + economy.healthcareSpending
    + economy.defenseSpending
    + economy.infrastructureSpending
    + economy.scienceSpending;

  // Cost of servicing the national debt
  const interestPayments =
    economy.debt * (economy.interestRate / 100);

  // Surplus or deficit
  const budgetBalance =
    revenue - expenses - interestPayments;

  // Debt compared to GDP
  const debtToGdp =
    (economy.debt / economy.gdp) * 100;

  return {
    revenue,
    expenses,
    budgetBalance,
    interestPayments,
    debtToGdp,
  };
}