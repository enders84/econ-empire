import type { GameState } from "../../models/GameState";
import { runMonopoly } from "./monopoly";
import { calculateDemand } from "./calculateDemand";
import { runPerfectCompetition } from "./perfectCompetition";
import { runMonopolisticCompetition } from "./monopolisticCompetition";
export interface MarketResult {
  price: number;
  quantityDemanded: number;
  marginalRevenue: number;
}

export function runMarket(
  state: GameState,
): MarketResult {
  switch (state.market.structure) {
    case "Perfect Competition": {
      const result =
        runPerfectCompetition(state);

      return {
        price: result.marketPrice,
        quantityDemanded:
          result.quantityDemanded,
        marginalRevenue:
          result.marginalRevenue,
      };
    }

    case "Monopolistic Competition": {
      const result = runMonopolisticCompetition(state);
      return {
        price: result.price,
        quantityDemanded:
      result.quantityDemanded,
    marginalRevenue:
      result.marginalRevenue,
      };
    }

    case "Oligopoly": {
      const quantityDemanded =
        calculateDemand(state);

      return {
        price: state.firm.price,
        quantityDemanded,
        marginalRevenue: 0,
      };
    }

    case "Monopoly": {
  const result =
    runMonopoly(state);

  return {
    price: result.price,
    quantityDemanded:
      result.quantityDemanded,
    marginalRevenue:
      result.marginalRevenue,
  };
}

    default: {
      const quantityDemanded =
        calculateDemand(state);

      return {
        price: state.firm.price,
        quantityDemanded,
        marginalRevenue: 0,
      };
    }
  }
}