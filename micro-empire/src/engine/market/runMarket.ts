import type { GameState } from "../../models/GameState";

import { calculateDemand } from "./calculateDemand";
import { runMonopoly } from "./monopoly";
import { runMonopolisticCompetition } from "./monopolisticCompetition";
import { runOligopoly } from "./oligopoly";
import { runPerfectCompetition } from "./perfectCompetition";

export interface MarketResult {
  price: number;
  quantityDemanded: number;
  marginalRevenue: number;
}

export function runMarket(
  state: GameState,
): MarketResult {
  switch (state.market.structure) {
    /*
     * ======================================
     * PERFECT COMPETITION
     * ======================================
     *
     * The firm is a price taker.
     */
    case "Perfect Competition": {
      const result =
        runPerfectCompetition(state);

      return {
        price:
          result.marketPrice,

        quantityDemanded:
          result.quantityDemanded,

        marginalRevenue:
          result.marginalRevenue,
      };
    }

    /*
     * ======================================
     * MONOPOLISTIC COMPETITION
     * ======================================
     *
     * The firm has some pricing power
     * because its product is differentiated.
     */
    case "Monopolistic Competition": {
      const result =
        runMonopolisticCompetition(
          state,
        );

      return {
        price:
          result.price,

        quantityDemanded:
          result.quantityDemanded,

        marginalRevenue:
          result.marginalRevenue,
      };
    }

    /*
     * ======================================
     * OLIGOPOLY
     * ======================================
     *
     * The firm's demand depends partly on
     * its price relative to rival firms.
     */
    case "Oligopoly": {
      const result =
        runOligopoly(state);

      return {
        price:
          result.price,

        quantityDemanded:
          result.quantityDemanded,

        marginalRevenue:
          result.marginalRevenue,
      };
    }

    /*
     * ======================================
     * MONOPOLY
     * ======================================
     *
     * The monopolist faces the entire
     * market demand curve.
     */
    case "Monopoly": {
      const result =
        runMonopoly(state);

      return {
        price:
          result.price,

        quantityDemanded:
          result.quantityDemanded,

        marginalRevenue:
          result.marginalRevenue,
      };
    }

    /*
     * FALLBACK
     *
     * This shouldn't normally be reached,
     * but keeping a fallback makes the
     * engine more defensive.
     */
    default: {
      const quantityDemanded =
        calculateDemand(state);

      return {
        price:
          state.firm.price,

        quantityDemanded,

        marginalRevenue: 0,
      };
    }
  }
}