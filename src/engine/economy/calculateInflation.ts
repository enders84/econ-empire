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

  // GDP above potential creates upward price pressure.
  // GDP below potential creates downward price pressure.
  const demandPressure =
    outputGap * 0.06;

  // Government spending above 20% of GDP adds
  // extra inflationary pressure.
  const spendingPressure =
    Math.max(0, governmentShare - 0.20) *
    1.5;

  const neutralInterestRate = 2.5;

  // Rates below neutral raise inflation pressure.
  // Rates above neutral reduce inflation pressure.
  const monetaryPressure =
    (neutralInterestRate - interestRate) *
    0.08;

  const targetInflation =
    previousInflation +
    demandPressure +
    spendingPressure +
    monetaryPressure;

  // Inflation changes gradually because prices
  // and expectations have inertia.
  const adjustmentSpeed = 0.20;

  const inflation =
    previousInflation +
    (targetInflation - previousInflation) *
      adjustmentSpeed;

  return round(
    clamp(inflation, -2, 15),
  );
}