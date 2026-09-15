import type { GameState } from "../../models/GameState";
import type { BusinessCycle } from "../../models/BusinessCycle";

export function calculateBusinessCycle(
  previousState: GameState,
  currentState: GameState,
): BusinessCycle {
  const history = previousState.history;

  const recentGrowth = history
    .slice(-3)
    .map((point) => point.gdpGrowth);

  const currentGrowth =
    ((currentState.economy.gdp -
      previousState.economy.gdp) /
      Math.max(previousState.economy.gdp, 1)) *
    100;

  const growthSeries = [
    ...recentGrowth,
    currentGrowth,
  ];

  const averageGrowth =
    growthSeries.reduce(
      (sum, value) => sum + value,
      0,
    ) / Math.max(growthSeries.length, 1);

  const negativeGrowthQuarters =
    growthSeries.filter(
      (growth) => growth < 0,
    ).length;

  const positiveGrowthQuarters =
    growthSeries.filter(
      (growth) => growth > 0,
    ).length;

  const inflation =
    currentState.economy.inflation;

  const unemployment =
    currentState.economy.unemployment;

  const outputGap =
    currentState.economy.outputGap;

  const previousCycle =
    previousState.economy.businessCycle;

  // Sustained contraction with a weak labor market.
  if (
    negativeGrowthQuarters >= 2 &&
    outputGap < -2 &&
    unemployment > 6
  ) {
    return "Recession";
  }

  // Strong sustained growth with signs of overheating.
  if (
    averageGrowth > 0.75 &&
    positiveGrowthQuarters >= 3 &&
    (inflation > 3 || outputGap > 2)
  ) {
    return "Boom";
  }

  // Recovery requires that the economy was previously
  // weak and has now returned to positive growth.
  if (
    (previousCycle === "Recession" ||
      previousCycle === "Slowdown") &&
    currentGrowth > 0 &&
    outputGap < 0
  ) {
    return "Recovery";
  }

  // Sustained positive growth with healthy labor conditions.
  if (
    averageGrowth > 0.15 &&
    positiveGrowthQuarters >= 3 &&
    unemployment <= 6 &&
    outputGap >= -1.5
  ) {
    return "Expansion";
  }

  return "Slowdown";
}