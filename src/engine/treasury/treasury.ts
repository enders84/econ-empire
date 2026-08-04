import { ECONOMY } from "../../config/economy";
import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runTreasury(
  state: GameState,
): GameState {
  const annualizedGDP = Math.max(
    state.economy.gdp,
    0,
  );

  const incomeTaxRate =
    state.policy.incomeTaxRate / 100;

  const taxableShareOfGDP =
    ECONOMY.TAXABLE_SHARE_OF_GDP;

  /*
   * GDP is displayed as an annualized economic level,
   * but each simulation turn represents one quarter.
   * Convert annual revenue into a quarterly flow.
   */
  const annualRevenue =
    annualizedGDP *
    taxableShareOfGDP *
    incomeTaxRate;

  const quarterlyRevenue =
    annualRevenue / 4;

  /*
   * Government spending is also treated as an
   * annual budget, so only one quarter of it should
   * be charged during each turn.
   */
  const annualProgramExpenses =
    state.economy.governmentSpending;

  const quarterlyProgramExpenses =
    annualProgramExpenses / 4;

  const quarterlyInterestRate =
    state.policy.policyInterestRate /
    100 /
    4;

  const interestPayments =
    state.treasury.debt *
    quarterlyInterestRate;

  const quarterlyExpenses =
    quarterlyProgramExpenses +
    interestPayments;

  const budgetBalance =
    quarterlyRevenue -
    quarterlyExpenses;

  /*
   * A deficit is negative, so subtracting it adds
   * to debt. A surplus is positive and reduces debt.
   */
  const debt = Math.max(
    0,
    state.treasury.debt -
      budgetBalance,
  );

  const debtToGdp =
    annualizedGDP > 0
      ? (debt / annualizedGDP) * 100
      : 0;

  return {
    ...state,

    treasury: {
      ...state.treasury,

      revenue: round(quarterlyRevenue),
      expenses: round(quarterlyExpenses),
      interestPayments:
        round(interestPayments),

      budgetBalance:
        round(budgetBalance),

      debt: round(debt),
      debtToGdp: round(debtToGdp),
    },
  };
}