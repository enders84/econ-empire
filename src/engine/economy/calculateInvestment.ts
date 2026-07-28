import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateInvestment(
  state: GameState,
): number {
  const {
    gdp,
    investment: previousInvestment,
    inflation,
    unemployment,
    interestRate,
  } = state.economy;

  const normalInvestmentShare = 0.2;

  const targetInvestmentBeforeConditions =
    gdp * normalInvestmentShare;

  const interestRateEffect = clamp(
    1 - (interestRate - 3) * 0.025,
    0.65,
    1.2,
  );

  const inflationEffect = clamp(
    1 - Math.max(0, inflation - 3) * 0.015,
    0.75,
    1.05,
  );

  const laborMarketEffect = clamp(
    1 - Math.max(0, unemployment - 5) * 0.015,
    0.75,
    1.05,
  );

  const targetInvestment =
    targetInvestmentBeforeConditions *
    interestRateEffect *
    inflationEffect *
    laborMarketEffect;

  // Investment moves gradually toward its target.
  // This prevents a falling-GDP feedback loop.
  const adjustmentSpeed = 0.12;

  const investment =
    previousInvestment +
    (targetInvestment - previousInvestment) *
      adjustmentSpeed;

  return round(Math.max(0, investment));
}