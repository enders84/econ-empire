import type { GameState } from "../../models/GameState";
import { calculateConsumption } from "./calculateConsumption";
import { calculateInvestment } from "./calculateInvestment";
import { calculateGovernment } from "./calculateGovernment";
import { calculateTrade } from "./calculateTrade";
import { calculateGDP } from "./calculateGDP";

export function runEconomy(
  state: GameState,
): GameState {
  const consumption = calculateConsumption(state);
  const investment = calculateInvestment(state);
  const governmentSpending =
    calculateGovernment(state);

  const trade = calculateTrade(state);

  const stateWithComponents: GameState = {
    ...state,

    economy: {
      ...state.economy,
      consumption,
      investment,
      governmentSpending,
      exports: trade.exports,
      imports: trade.imports,
    },
  };

  const gdp = calculateGDP(stateWithComponents);

  return {
    ...stateWithComponents,

    economy: {
      ...stateWithComponents.economy,
      gdp,
    },
  };
}