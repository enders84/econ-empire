import type { GameEvent } from "../../models/Event";
import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function applyEvent(
  state: GameState,
  event: GameEvent,
): GameState {
  return {
    ...state,

    economy: {
      ...state.economy,

      gdp: round(
        state.economy.gdp *
          (1 + (event.effects.gdp ?? 0) / 100),
      ),

      inflation: round(
        state.economy.inflation +
          (event.effects.inflation ?? 0),
      ),

      unemployment: round(
        state.economy.unemployment +
          (event.effects.unemployment ?? 0),
      ),

      productivity: round(
        state.economy.productivity *
          (1 + (event.effects.productivity ?? 0)),
      ),
    },

    treasury: {
      ...state.treasury,

      debt: round(
        state.treasury.debt +
          (event.effects.debt ?? 0),
      ),
    },

    politics: {
      ...state.politics,

      approval: round(
        state.politics.approval +
          (event.effects.approval ?? 0),
      ),
    },
  };
}