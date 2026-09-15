import { ECONOMY } from "../../config/economy";
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
    gdp: previousGDP,
  } = state.economy;

  const netExports = exports - imports;

  // GDP implied by this quarter's demand.
  const demandGDP =
    consumption +
    investment +
    governmentSpending +
    netExports;

  // Blend last quarter's GDP with this quarter's
  // demand so the economy has momentum.
  const momentum =
    ECONOMY.GDP_MOMENTUM;

  const gdp =
    previousGDP * momentum +
    demandGDP * (1 - momentum);

  return round(Math.max(0, gdp));
}