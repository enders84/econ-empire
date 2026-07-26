import type { GameState } from "../models/GameState";

export function simulateQuarter(state: GameState): GameState {
  return {
    ...state,
    quarter: state.quarter + 1,
    gdp: state.gdp + 8,
    inflation: state.inflation + 0.1,
    unemployment: state.unemployment - 0.1,
    debt: state.debt + 5,
    approval: state.approval - 1,
  };
}