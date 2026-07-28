import type { GameState } from "../../models/GameState";

export interface TradeResult {
  exports: number;
  imports: number;
  netExports: number;
}

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

export function calculateTrade(state: GameState): TradeResult {
  const {
    gdp,
    exports: previousExports,
    imports: previousImports,
    inflation,
    interestRate,
  } = state.economy;

  const exportCompetitiveness = clamp(
    1 - Math.max(0, inflation - 2) * 0.015,
    0.7,
    1.15,
  );

  const interestRateEffect = clamp(
    1 - Math.max(0, interestRate - 3) * 0.005,
    0.9,
    1.05,
  );

  const exports =
    previousExports > 0
      ? previousExports * exportCompetitiveness * interestRateEffect
      : gdp * 0.12 * exportCompetitiveness;

  const domesticDemand = state.economy.consumption + state.economy.investment;

  const importDemandEffect = clamp(
    domesticDemand / Math.max(gdp, 1),
    0.65,
    1.35,
  );

  const imports =
    previousImports > 0
      ? previousImports * importDemandEffect
      : gdp * 0.14 * importDemandEffect;

  return {
    exports: Math.max(0, exports),
    imports: Math.max(0, imports),
    netExports: exports - imports,
  };
}