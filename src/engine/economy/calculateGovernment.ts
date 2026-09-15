import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateGovernment(
  state: GameState,
): number {
  const {
    educationBudget,
    healthcareBudget,
    defenseBudget,
    infrastructureBudget,
    scienceBudget,
  } = state.policy;

  const governmentSpending =
    educationBudget +
    healthcareBudget +
    defenseBudget +
    infrastructureBudget +
    scienceBudget;

  return round(governmentSpending);
}