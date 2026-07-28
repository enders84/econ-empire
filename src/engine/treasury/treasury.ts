import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runTreasury(
  state: GameState,
): GameState {
  const taxableIncomeShare = 0.65;

  const revenue =
    state.economy.gdp *
    taxableIncomeShare *
    (state.treasury.incomeTax / 100);

  const programExpenses =
    state.treasury.educationSpending +
    state.treasury.healthcareSpending +
    state.treasury.defenseSpending +
    state.treasury.infrastructureSpending +
    state.treasury.scienceSpending;

  const quarterlyInterestRate =
    state.economy.interestRate / 100 / 4;

  const interestPayments =
    state.treasury.debt * quarterlyInterestRate;

  const expenses =
    programExpenses + interestPayments;

  const budgetBalance =
    revenue - expenses;

  const debt =
    Math.max(
      0,
      state.treasury.debt - budgetBalance,
    );

  const debtToGdp =
    state.economy.gdp > 0
      ? (debt / state.economy.gdp) * 100
      : 0;

  return {
    ...state,

    treasury: {
      ...state.treasury,

      revenue: round(revenue),
      expenses: round(expenses),
      interestPayments: round(interestPayments),
      budgetBalance: round(budgetBalance),
      debt: round(debt),
      debtToGdp: round(debtToGdp),
    },
  };
}