import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

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

  // Okun's Law:
  // Positive output gap lowers unemployment.
  // Negative output gap raises unemployment.
  const outputGapEffect =
    outputGap * -0.08;

  // Higher interest rates slightly weaken hiring.
  const neutralInterestRate = 3;

  const interestRateEffect =
    Math.max(
      0,
      interestRate - neutralInterestRate,
    ) * 0.03;

  const targetUnemployment =
    previousUnemployment +
    outputGapEffect +
    interestRateEffect;

  // Labor markets adjust gradually.
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