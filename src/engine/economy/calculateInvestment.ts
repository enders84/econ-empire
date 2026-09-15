import type { GameState } from "../../models/GameState";
import { ECONOMY } from "../../config/economy";

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
    potentialGdp,
    outputGap,
    investment: previousInvestment,
    inflation,
    unemployment,
  } = state.economy;

  const interestRate =
    state.policy.policyInterestRate;

  const normalInvestmentShare = 0.20;

  // Anchor long-run investment to productive capacity,
  // not current GDP. This prevents GDP and investment
  // from reinforcing each other indefinitely.
  const baseInvestment =
    potentialGdp * normalInvestmentShare;

  // Lower rates stimulate investment;
  // higher rates discourage investment.
  const interestRateEffect = clamp(
    1 - (interestRate - 3) * 0.025,
    0.65,
    1.20,
  );

  // High inflation creates uncertainty and reduces
  // real business investment.
  const inflationEffect = clamp(
    1 - Math.max(0, inflation - 3) * 0.015,
    0.75,
    1.05,
  );

  // Weak labor markets reduce expected demand.
  const laborMarketEffect = clamp(
    1 - Math.max(0, unemployment - 5) * 0.015,
    0.75,
    1.05,
  );

  // Firms invest somewhat more when capacity is tight,
  // but the effect is deliberately limited.
  const outputGapEffect = clamp(
    1 + outputGap * 0.01,
    0.90,
    1.10,
  );

  const targetInvestment =
    baseInvestment *
    interestRateEffect *
    inflationEffect *
    laborMarketEffect *
    outputGapEffect;

  const adjustmentSpeed =
    ECONOMY.INVESTMENT_ADJUSTMENT;

  const investment =
    previousInvestment +
    (targetInvestment - previousInvestment) *
      adjustmentSpeed;

  return round(
    Math.max(0, investment),
  );
}