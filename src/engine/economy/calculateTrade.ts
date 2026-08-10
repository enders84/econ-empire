import type { GameState } from "../../models/GameState";

export interface TradeResult {
  exports: number;
  imports: number;
  netExports: number;
}

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateTrade(
  state: GameState,
): TradeResult {
  const {
    gdp,
    potentialGdp,
    exports: previousExports,
    imports: previousImports,
    inflation,
    consumption,
    investment,
  } = state.economy;

  const interestRate =
    state.policy.policyInterestRate;

  /*
   * EXPORTS
   *
   * Long-run exports are anchored to productive
   * capacity instead of last quarter's exports.
   */
  const normalExportShare = 0.12;

  const baseExports =
    potentialGdp * normalExportShare;

  // High domestic inflation makes exports
  // less internationally competitive.
  const exportCompetitiveness = clamp(
    1 - (inflation - 2) * 0.015,
    0.75,
    1.15,
  );

  // Higher interest rates can strengthen the currency,
  // making domestic exports somewhat less competitive.
  const exportInterestRateEffect = clamp(
    1 - (interestRate - 3) * 0.01,
    0.90,
    1.10,
  );

  const targetExports =
    baseExports *
    exportCompetitiveness *
    exportInterestRateEffect;

  /*
   * IMPORTS
   *
   * Imports are anchored to GDP and rise when
   * household and business demand is strong.
   */
  const normalImportShare = 0.12;

  const baseImports =
    gdp * normalImportShare;

  const domesticDemand =
    consumption + investment;

  const normalDomesticDemandShare = 0.80;

  const actualDomesticDemandShare =
    domesticDemand / Math.max(gdp, 1);

  const importDemandEffect = clamp(
    actualDomesticDemandShare /
      normalDomesticDemandShare,
    0.75,
    1.25,
  );

  // Higher domestic inflation encourages purchases
  // of relatively cheaper foreign goods.
  const importInflationEffect = clamp(
    1 + Math.max(0, inflation - 2) * 0.01,
    1,
    1.15,
  );

  const targetImports =
    baseImports *
    importDemandEffect *
    importInflationEffect;

  /*
   * Trade flows adjust gradually instead of
   * jumping immediately or compounding forever.
   */
  const adjustmentSpeed = 0.15;

  const exports =
    previousExports +
    (targetExports - previousExports) *
      adjustmentSpeed;

  const imports =
    previousImports +
    (targetImports - previousImports) *
      adjustmentSpeed;

  const roundedExports =
    round(Math.max(0, exports));

  const roundedImports =
    round(Math.max(0, imports));

  return {
    exports: roundedExports,
    imports: roundedImports,
    netExports: round(
      roundedExports - roundedImports,
    ),
  };
}