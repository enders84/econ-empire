import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 10000) / 10000;

export function calculateUnemployment(
  previousState: GameState,
  updatedState: GameState,
): number {
  const previousUnemployment =
    previousState.economy.unemployment;

  const outputGap =
    updatedState.economy.outputGap;

  const interestRate =
    updatedState.policy.policyInterestRate;

  // Positive output gaps increase hiring.
  // Negative output gaps increase unemployment.
  const outputGapEffect =
    outputGap * -0.08;

  const neutralInterestRate = 3;

  // Rates above neutral raise unemployment;
  // rates below neutral support employment.
  const interestRateEffect =
    (interestRate - neutralInterestRate) * 0.03;

  const targetUnemployment =
    previousUnemployment +
    outputGapEffect +
    interestRateEffect;

  // Labor-market changes occur gradually.
  const adjustmentSpeed = 0.35;

  const unemployment =
    previousUnemployment +
    (targetUnemployment -
      previousUnemployment) *
      adjustmentSpeed;

  return round(
    clamp(unemployment, 2, 25),
  );
}