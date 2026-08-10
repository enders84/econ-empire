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
    potentialGdp,
    consumption: previousConsumption,
    unemployment,
    inflation,
  } = state.economy;

  const incomeTax =
    state.policy.incomeTaxRate;

  const interestRate =
    state.policy.policyInterestRate;

  const taxRate = clamp(
    incomeTax / 100,
    0,
    1,
  );

  /*
   * LONG-RUN CONSUMPTION
   *
   * Consumption is anchored to potential GDP rather
   * than current GDP. This prevents a temporary GDP
   * decline from creating a permanent downward spiral.
   */
  const potentialDisposableIncome =
    potentialGdp * (1 - taxRate);

  const marginalPropensityToConsume = 0.80;

  const baseConsumption =
    potentialDisposableIncome *
    marginalPropensityToConsume;

  /*
   * LABOR MARKET
   *
   * 5% unemployment is treated as approximately
   * normal. Only unemployment above that level
   * significantly reduces consumption.
   */
  const unemploymentEffect = clamp(
    1 -
      Math.max(0, unemployment - 5) *
        0.012,
    0.80,
    1.02,
  );

  /*
   * INFLATION
   *
   * 2% is approximately neutral.
   */
  const inflationEffect = clamp(
    1 -
      Math.max(0, inflation - 2) *
        0.008,
    0.85,
    1,
  );

  /*
   * INTEREST RATES
   *
   * 3% is our neutral policy rate.
   */
  const interestRateEffect = clamp(
    1 -
      Math.max(0, interestRate - 3) *
        0.008,
    0.85,
    1,
  );

  const targetConsumption =
    baseConsumption *
    unemploymentEffect *
    inflationEffect *
    interestRateEffect;

  /*
   * Household spending adjusts gradually.
   */
  const adjustmentSpeed = 0.15;

  const consumption =
    previousConsumption +
    (targetConsumption -
      previousConsumption) *
      adjustmentSpeed;

  return round(
    Math.max(0, consumption),
  );
}