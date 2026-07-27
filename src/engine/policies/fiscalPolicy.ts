import type { GameState } from "../../models/GameState";

const DEFAULTS = {
  gdp: 100,
  debt: 0,
  incomeTax: 25,
  interestRate: 3,
} as const;

function safeNumber(
  value: number,
  fallback: number
): number {
  return Number.isFinite(value)
    ? value
    : fallback;
}

export function applyFiscalPolicy(
  state: GameState
): GameState {
  const educationSpending = safeNumber(
    state.educationSpending,
    0
  );

  const healthcareSpending = safeNumber(
    state.healthcareSpending,
    0
  );

  const defenseSpending = safeNumber(
    state.defenseSpending,
    0
  );

  const infrastructureSpending = safeNumber(
    state.infrastructureSpending,
    0
  );

  const scienceSpending = safeNumber(
    state.scienceSpending,
    0
  );

  const incomeTax = safeNumber(
    state.incomeTax,
    DEFAULTS.incomeTax
  );

  const interestRate = safeNumber(
    state.interestRate,
    DEFAULTS.interestRate
  );

  const gdp = safeNumber(
    state.gdp,
    DEFAULTS.gdp
  );

  const currentDebt = safeNumber(
    state.debt,
    DEFAULTS.debt
  );

  const totalSpending =
    educationSpending +
    healthcareSpending +
    defenseSpending +
    infrastructureSpending +
    scienceSpending;

  const quarterlyTaxRevenue =
    gdp *
    (incomeTax / 100) *
    0.25;

  const quarterlyDebtInterest =
    currentDebt *
    (interestRate / 100) *
    0.25;

  const budgetBalance =
    quarterlyTaxRevenue -
    totalSpending -
    quarterlyDebtInterest;

  const debt = Math.max(
    0,
    currentDebt - budgetBalance
  );

  return {
    ...state,
    debt,
  };
}