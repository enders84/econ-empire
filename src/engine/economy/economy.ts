import type { GameState } from "../../models/GameState";
import { calculateConsumption } from "./calculateConsumption";
import { calculateInvestment } from "./calculateInvestment";
import { calculateGovernment } from "./calculateGovernment";
import { calculateTrade } from "./calculateTrade";
import { calculateGDP } from "./calculateGDP";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runEconomy(
  state: GameState,
): GameState {
  const {
    educationBudget,
    scienceBudget,
    infrastructureBudget,
  } = state.policy;

  const baseProductivityGrowth = 0.001;

  const educationGrowthBonus =
    educationBudget * 0.000002;

  const scienceGrowthBonus =
    scienceBudget * 0.000003;

  const productivityGrowthRate =
    baseProductivityGrowth +
    educationGrowthBonus +
    scienceGrowthBonus;

  const productivity =
    state.economy.productivity *
    (1 + productivityGrowthRate);

  const infrastructureGrowthRate =
    infrastructureBudget * 0.000002;

  const potentialGdp =
    state.economy.potentialGdp *
    (1 +
      productivityGrowthRate +
      infrastructureGrowthRate);

  const stateWithGrowth: GameState = {
    ...state,

    economy: {
      ...state.economy,
      productivity: round(productivity),
      potentialGdp: round(potentialGdp),
    },
  };

  const consumption =
    calculateConsumption(stateWithGrowth);

  const investment =
    calculateInvestment(stateWithGrowth);

  const governmentSpending =
    calculateGovernment(stateWithGrowth);

  const trade =
    calculateTrade(stateWithGrowth);

  const stateWithComponents: GameState = {
    ...stateWithGrowth,

    economy: {
      ...stateWithGrowth.economy,
      consumption,
      investment,
      governmentSpending,
      exports: trade.exports,
      imports: trade.imports,
    },
  };

  const gdp =
    calculateGDP(stateWithComponents);

  const outputGap =
    potentialGdp > 0
      ? ((gdp - potentialGdp) / potentialGdp) * 100
      : 0;

  return {
    ...stateWithComponents,

    economy: {
      ...stateWithComponents.economy,
      gdp,
      outputGap: round(outputGap),
    },
  };
}