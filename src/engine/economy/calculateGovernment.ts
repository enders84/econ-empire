import type { GameState } from "../../models/GameState";

export function calculateGovernment(state: GameState): number {
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

  return Math.max(0, governmentSpending);
}