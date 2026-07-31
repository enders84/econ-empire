import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runTreasury(
  state: GameState,
): GameState {
  const gdp = Math.max(state.economy.gdp, 0);

  const incomeTaxRate =
    state.policy.incomeTaxRate / 100;

  const taxableShareOfGDP = 0.65;

  const revenue =
    gdp *
    taxableShareOfGDP *
    incomeTaxRate;

  const programExpenses =
    state.economy.governmentSpending;

  const quarterlyInterestRate =
    state.economy.interestRate / 100 / 4;

  const interestPayments =
    state.treasury.debt *
    quarterlyInterestRate;

  const expenses =
    programExpenses +
    interestPayments;

  const budgetBalance =
    revenue -
    expenses;

  const debt =
    Math.max(
      0,
      state.treasury.debt -
        budgetBalance,
    );

  const debtToGdp =
    gdp > 0
      ? (debt / gdp) * 100
      : 0;

  return {
    ...state,

    treasury: {
      ...state.treasury,

      revenue: round(revenue),
      expenses: round(expenses),
      interestPayments:
        round(interestPayments),

      budgetBalance:
        round(budgetBalance),

      debt: round(debt),
      debtToGdp: round(debtToGdp),
    },
  };
}