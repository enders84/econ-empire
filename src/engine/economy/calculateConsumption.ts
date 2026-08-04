import { ECONOMY } from "../../config/economy";
import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateConsumption(
  state: GameState,
): number {
  const {
    gdp,
    consumption: previousConsumption,
    unemployment,
    inflation,
  } = state.economy;

  const taxRate = clamp(
    state.policy.incomeTaxRate / 100,
    0,
    1,
  );

  const interestRate =
    state.policy.policyInterestRate;

  // Not all GDP becomes household income.
  const householdIncomeShare = 0.78;

  const grossHouseholdIncome =
    gdp * householdIncomeShare;

  const disposableIncome =
    grossHouseholdIncome * (1 - taxRate);

  // Higher unemployment lowers household income
  // and consumer confidence.
  const unemploymentEffect = clamp(
    1 - Math.max(0, unemployment - 4) * 0.025,
    0.65,
    1.05,
  );

  // Inflation above target reduces purchasing power.
  // Mildly low inflation is not penalized.
  const inflationEffect = clamp(
    1 - Math.max(0, inflation - 2) * 0.015,
    0.75,
    1.02,
  );

  // Higher rates encourage saving and make credit
  // purchases more expensive. Lower rates provide
  // a modest spending boost.
  const interestRateEffect = clamp(
    1 - (interestRate - 2.5) * 0.012,
    0.80,
    1.08,
  );

  const marginalPropensityToConsume = 0.82;

  const targetConsumption =
    disposableIncome *
    marginalPropensityToConsume *
    unemploymentEffect *
    inflationEffect *
    interestRateEffect;

  const adjustmentSpeed =
    ECONOMY.CONSUMPTION_ADJUSTMENT;

  const consumption =
    previousConsumption +
    (targetConsumption - previousConsumption) *
      adjustmentSpeed;

  return round(
    Math.max(0, consumption),
  );
}