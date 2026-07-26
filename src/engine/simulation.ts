import type { GameState } from "../models/GameState";

import { applyRandomEvent } from "./events";
import { applyFiscalPolicy } from "./fiscalPolicy";
import { applyMonetaryPolicy } from "./monetaryPolicy";
import { updateEconomy } from "./economy";
import { updateApproval } from "./approval";

export function simulateQuarter(state: GameState) {
  const next = { ...state };

  next.quarter += 1;

  applyFiscalPolicy(next);
  console.log("After fiscal policy:", next);

  applyMonetaryPolicy(next);
  console.log("After monetary policy:", next);

  updateEconomy(next);
  console.log("After economy update:", next);

  const event = applyRandomEvent(next);
  console.log("After random event:", next);

  updateApproval(state, next);
  console.log("After approval:", next);

  next.inflation = Math.max(0, next.inflation);
  next.unemployment = Math.max(2, next.unemployment);
  next.gdp = Math.max(100, next.gdp);
  next.debt = Math.max(0, next.debt);
  next.approval = Math.min(
    100,
    Math.max(0, next.approval)
  );

  return {
    economy: next,
    event,
  };
}