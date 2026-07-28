import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateGDP(
  state: GameState,
): number {
  const {
    consumption,
    investment,
    governmentSpending,
    exports,
    imports,
  } = state.economy;

  const netExports = exports - imports;

  const gdp =
    consumption +
    investment +
    governmentSpending +
    netExports;

  return round(Math.max(0, gdp));
}