import type { GameState } from "../../models/GameState";
import type { BusinessCycle } from "../../models/BusinessCycle";

export function calculateBusinessCycle(
  previousState: GameState,
  currentState: GameState,
): BusinessCycle {
  const previousGDP =
    previousState.economy.gdp;

  const currentGDP =
    currentState.economy.gdp;

  const growth =
    ((currentGDP - previousGDP) /
      Math.max(previousGDP, 1)) *
    100;

  const inflation =
    currentState.economy.inflation;

  const unemployment =
    currentState.economy.unemployment;

  if (
    growth < -1 &&
    unemployment > 7
  ) {
    return "Recession";
  }

  if (
    growth > 2 &&
    inflation > 3
  ) {
    return "Boom";
  }

  if (
    growth > 1 &&
    unemployment < 5.5
  ) {
    return "Expansion";
  }

  if (
    growth > 0 &&
    unemployment > 6
  ) {
    return "Recovery";
  }

  return "Slowdown";
}