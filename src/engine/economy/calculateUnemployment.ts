import { ECONOMY } from "../../config/economy";
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

  const interestRate =
    updatedState.policy.policyInterestRate;

  // Prevent an extreme output gap from immediately
  // driving unemployment to its maximum.
  const outputGap = clamp(
    updatedState.economy.outputGap,
    -10,
    10,
  );

  const naturalUnemploymentRate = 5;

  // GDP above potential lowers the target rate.
  // GDP below potential raises the target rate.
  const outputGapEffect =
    outputGap * -0.25;

  // Rates above neutral weaken employment;
  // rates below neutral support employment.
  const interestRateEffect =
    (interestRate -
      ECONOMY.NEUTRAL_LABOR_RATE) *
    0.10;

  const targetUnemployment = clamp(
    naturalUnemploymentRate +
      outputGapEffect +
      interestRateEffect,
    ECONOMY.MIN_UNEMPLOYMENT,
    ECONOMY.MAX_UNEMPLOYMENT,
  );

  const adjustmentSpeed =
    ECONOMY.UNEMPLOYMENT_ADJUSTMENT;

  const unemployment =
    previousUnemployment +
    (targetUnemployment -
      previousUnemployment) *
      adjustmentSpeed;

  return round(
    clamp(
      unemployment,
      ECONOMY.MIN_UNEMPLOYMENT,
      ECONOMY.MAX_UNEMPLOYMENT,
    ),
  );
}