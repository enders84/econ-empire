import type { GameEvent } from "../../models/Event";
import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

export function applyEvent(
  state: GameState,
  event: GameEvent,
): GameState {
  const gdp = round(
    state.economy.gdp *
      (1 + (event.effects.gdp ?? 0) / 100),
  );

  const debt = round(
    Math.max(
      0,
      state.treasury.debt +
        (event.effects.debt ?? 0),
    ),
  );

  const debtToGdp =
    gdp > 0
      ? round((debt / gdp) * 100)
      : 0;

  return {
    ...state,

    economy: {
      ...state.economy,

      gdp,

      inflation: round(
        clamp(
          state.economy.inflation +
            (event.effects.inflation ?? 0),
          -2,
          15,
        ),
      ),

      unemployment: round(
        clamp(
          state.economy.unemployment +
            (event.effects.unemployment ?? 0),
          2,
          25,
        ),
      ),

      productivity: round(
        Math.max(
          0,
          state.economy.productivity *
            (1 +
              (event.effects.productivity ?? 0)),
        ),
      ),
    },

    treasury: {
      ...state.treasury,
      debt,
      debtToGdp,
    },

    politics: {
      ...state.politics,

      approval: round(
        clamp(
          state.politics.approval +
            (event.effects.approval ?? 0),
          0,
          100,
        ),
      ),
    },
  };
}