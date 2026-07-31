import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateInflation(
  previousState: GameState,
  updatedState: GameState,
): number {
  const previousInflation =
    previousState.economy.inflation;

  const outputGap =
    updatedState.economy.outputGap;

  const interestRate =
    updatedState.policy.policyInterestRate;

  const currentGDP = Math.max(
    updatedState.economy.gdp,
    1,
  );

  const governmentShare =
    updatedState.economy.governmentSpending /
    currentGDP;

  // A positive output gap creates inflationary
  // pressure; a negative gap reduces inflation.
  const demandPressure =
    outputGap * 0.06;

  const spendingPressure =
    Math.max(0, governmentShare - 0.20) *
    1.5;

  // Rates above the neutral rate reduce inflation.
  const neutralInterestRate = 2.5;

  const monetaryPressure =
    (neutralInterestRate - interestRate) *
    0.08;

  const targetInflation =
    previousInflation +
    demandPressure +
    spendingPressure +
    monetaryPressure;

  // Inflation adjusts gradually because prices
  // and expectations are persistent.
  const adjustmentSpeed = 0.20;

  const inflation =
    previousInflation +
    (targetInflation - previousInflation) *
      adjustmentSpeed;

  return round(
    clamp(inflation, -2, 15),
  );
}