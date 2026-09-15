import { ECONOMY } from "../../config/economy";
import type { GameState } from "../../models/GameState";

import { calculateConsumption } from "./calculateConsumption";
import { calculateGDP } from "./calculateGDP";
import { calculateGovernment } from "./calculateGovernment";
import { calculateInvestment } from "./calculateInvestment";
import { calculateTrade } from "./calculateTrade";

const round = (
  value: number,
  decimalPlaces = 2,
): number => {
  const multiplier = 10 ** decimalPlaces;

  return (
    Math.round(value * multiplier) /
    multiplier
  );
};

export function runEconomy(
  state: GameState,
): GameState {
  const {
    educationBudget,
    scienceBudget,
    infrastructureBudget,
  } = state.policy;

  const productivityGrowthRate =
    ECONOMY.BASE_PRODUCTIVITY_GROWTH +
    educationBudget *
      ECONOMY.EDUCATION_PRODUCTIVITY_MULTIPLIER +
    scienceBudget *
      ECONOMY.SCIENCE_PRODUCTIVITY_MULTIPLIER;

  const productivity =
    state.economy.productivity *
    (1 + productivityGrowthRate);

  const infrastructureGrowthRate =
    infrastructureBudget *
    ECONOMY.INFRASTRUCTURE_POTENTIAL_GDP_MULTIPLIER;

  const potentialGdpGrowthRate =
    productivityGrowthRate +
    infrastructureGrowthRate;

  const potentialGdp =
    state.economy.potentialGdp *
    (1 + potentialGdpGrowthRate);

  const stateWithGrowth: GameState = {
    ...state,

    economy: {
      ...state.economy,

      // Preserve extra precision so small quarterly
      // productivity gains are not rounded away.
      productivity: round(productivity, 4),

      potentialGdp: round(potentialGdp, 2),
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
      ? ((gdp - potentialGdp) /
          potentialGdp) *
        100
      : 0;

  return {
    ...stateWithComponents,

    economy: {
      ...stateWithComponents.economy,
      gdp,
      outputGap: round(outputGap, 2),
    },
  };
}