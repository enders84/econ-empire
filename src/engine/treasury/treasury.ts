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

  /*
   * INCOME TAX REVENUE
   */
  const incomeTaxRate =
    state.policy.incomeTaxRate / 100;

  const taxableShareOfGDP =
    ECONOMY.TAXABLE_SHARE_OF_GDP;

  const annualIncomeTaxRevenue =
    annualizedGDP *
    taxableShareOfGDP *
    incomeTaxRate;

  const quarterlyIncomeTaxRevenue =
    annualIncomeTaxRevenue / 4;

  /*
   * TARIFF REVENUE
   *
   * Imports are stored as annualized economic flows,
   * so tariff revenue must also be divided by four
   * for the quarterly treasury calculation.
   */
  const tariffRate =
    state.policy.tariffRate / 100;

  const annualImports = Math.max(
    state.economy.imports,
    0,
  );

  const annualTariffRevenue =
    annualImports * tariffRate;

  const quarterlyTariffRevenue =
    annualTariffRevenue / 4;

  /*
   * TOTAL GOVERNMENT REVENUE
   */
  const quarterlyRevenue =
    quarterlyIncomeTaxRevenue +
    quarterlyTariffRevenue;

  /*
   * PROGRAM SPENDING
   */
  const annualProgramExpenses =
    state.economy.governmentSpending;

  const quarterlyProgramExpenses =
    annualProgramExpenses / 4;

  /*
   * INTEREST PAYMENTS
   */
  const quarterlyInterestRate =
    state.policy.policyInterestRate /
    100 /
    4;

  const interestPayments =
    state.treasury.debt *
    quarterlyInterestRate;

  /*
   * TOTAL EXPENSES
   */
  const quarterlyExpenses =
    quarterlyProgramExpenses +
    interestPayments;

  /*
   * BUDGET BALANCE
   */
  const budgetBalance =
    quarterlyRevenue -
    quarterlyExpenses;

  /*
   * NATIONAL DEBT
   *
   * Negative budget balance = deficit,
   * which increases debt.
   *
   * Positive budget balance = surplus,
   * which reduces debt.
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

      revenue: round(
        quarterlyRevenue,
      ),

      expenses: round(
        quarterlyExpenses,
      ),

      interestPayments: round(
        interestPayments,
      ),

      budgetBalance: round(
        budgetBalance,
      ),

      debt: round(debt),

      debtToGdp: round(
        debtToGdp,
      ),
    },
  };
}