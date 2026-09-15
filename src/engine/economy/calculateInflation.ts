import { ECONOMY } from "../../config/economy";
import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 10000) / 10000;

export function calculateInflation(
  previousState: GameState,
  updatedState: GameState,
): number {
  const previousInflation =
    previousState.economy.inflation;

  const interestRate =
    updatedState.policy.policyInterestRate;

  const currentGDP = Math.max(
    updatedState.economy.gdp,
    1,
  );

  const governmentShare =
    updatedState.economy.governmentSpending /
    currentGDP;

  const outputGap = clamp(
    updatedState.economy.outputGap,
    -10,
    10,
  );

  const inflationTarget = 2;

  // GDP above potential raises the target inflation rate.
  // GDP below potential lowers it.
  const outputGapEffect =
    outputGap * 0.15;

  // Spending above 20% of GDP creates additional
  // demand pressure.
  const spendingEffect =
    Math.max(0, governmentShare - 0.20) *
    8;

  // Rates above neutral reduce inflation;
  // rates below neutral increase it.
  const interestRateEffect =
    (ECONOMY.NEUTRAL_INTEREST_RATE -
      interestRate) *
    0.20;

  const targetInflation = clamp(
    inflationTarget +
      outputGapEffect +
      spendingEffect +
      interestRateEffect,
    ECONOMY.MIN_INFLATION,
    ECONOMY.MAX_INFLATION,
  );

  const adjustmentSpeed =
    ECONOMY.INFLATION_ADJUSTMENT;

  const inflation =
    previousInflation +
    (targetInflation -
      previousInflation) *
      adjustmentSpeed;

  return round(
    clamp(
      inflation,
      ECONOMY.MIN_INFLATION,
      ECONOMY.MAX_INFLATION,
    ),
  );
}