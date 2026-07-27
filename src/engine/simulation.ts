import type { GameState } from "../models/GameState";
import type { GameEvent } from "../models/GameEvent";

import { updateEconomy } from "./economy/economy";
import { updateApproval } from "./politics/approval.ts";
import { applyFiscalPolicy } from "./policies/fiscalPolicy";
import { applyMonetaryPolicy } from "./policies/monetaryPolicy";
import { applyRandomEvent } from "./events/applyRandomEvent";

export interface SimulationResult {
  economy: GameState;
  event: GameEvent | null;
}

function safeNumber(
  value: number,
  fallback: number
): number {
  return Number.isFinite(value)
    ? value
    : fallback;
}

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

function normalizeGameState(
  state: GameState,
  fallback: GameState,
  quarter: number
): GameState {
  return {
    ...state,

    quarter,

    gdp: clamp(
      safeNumber(state.gdp, fallback.gdp),
      100,
      1_000_000
    ),

    inflation: clamp(
      safeNumber(
        state.inflation,
        fallback.inflation
      ),
      -2,
      30
    ),

    unemployment: clamp(
      safeNumber(
        state.unemployment,
        fallback.unemployment
      ),
      2,
      35
    ),

    debt: Math.max(
      0,
      safeNumber(state.debt, fallback.debt)
    ),

    approval: clamp(
      safeNumber(
        state.approval,
        fallback.approval
      ),
      0,
      100
    ),
  };
}

export function simulateQuarter(
  state: GameState,
  random: () => number = Math.random
): SimulationResult {
  const currentQuarter = safeNumber(
    state.quarter,
    1
  );

  const nextQuarter = currentQuarter + 1;

  let next: GameState = {
    ...state,
    quarter: nextQuarter,
  };

  next = applyFiscalPolicy(next);

  next = applyMonetaryPolicy(next);

  next = updateEconomy(
    next,
    random
  );

  const eventResult = applyRandomEvent(
    next,
    random
  );

  next = eventResult.state;

  next = updateApproval(
    state,
    next,
    random
  );

  next = normalizeGameState(
    next,
    state,
    nextQuarter
  );

  return {
    economy: next,
    event: eventResult.event,
  };
}