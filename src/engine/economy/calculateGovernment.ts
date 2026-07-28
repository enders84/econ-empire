import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateGovernment(
  state: GameState,
): number {
  const {
    educationSpending,
    healthcareSpending,
    defenseSpending,
    infrastructureSpending,
    scienceSpending,
  } = state.treasury;

  const governmentSpending =
    educationSpending +
    healthcareSpending +
    defenseSpending +
    infrastructureSpending +
    scienceSpending;

  return round(governmentSpending);
}