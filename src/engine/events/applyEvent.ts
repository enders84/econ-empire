import type { GameState } from "../../models/GameState";
import type { GameEvent } from "../../models/GameEvent";

const ECONOMIC_LIMITS = {
  gdp: {
    minimum: 100,
    maximum: 1_000_000,
  },
  inflation: {
    minimum: -2,
    maximum: 30,
  },
  unemployment: {
    minimum: 2,
    maximum: 35,
  },
  approval: {
    minimum: 0,
    maximum: 100,
  },
} as const;

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

export function applyEvent(
  state: GameState,
  event: GameEvent
): GameState {
  return {
    ...state,

    gdp: clamp(
      state.gdp + event.gdp,
      ECONOMIC_LIMITS.gdp.minimum,
      ECONOMIC_LIMITS.gdp.maximum
    ),

    inflation: clamp(
      state.inflation + event.inflation,
      ECONOMIC_LIMITS.inflation.minimum,
      ECONOMIC_LIMITS.inflation.maximum
    ),

    unemployment: clamp(
      state.unemployment +
        event.unemployment,
      ECONOMIC_LIMITS.unemployment.minimum,
      ECONOMIC_LIMITS.unemployment.maximum
    ),

    approval: clamp(
      state.approval + event.approval,
      ECONOMIC_LIMITS.approval.minimum,
      ECONOMIC_LIMITS.approval.maximum
    ),
  };
}