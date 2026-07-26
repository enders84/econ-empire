import type { GameState } from "../models/GameState";

export function applyMonetaryPolicy(next: GameState) {
  const interestRate = Number(next.interestRate);

  if (!Number.isFinite(interestRate)) {
    console.error(
      "Invalid interest rate:",
      next.interestRate
    );

    return;
  }

  const rateDifference = interestRate - 3;

  // Higher rates slow the economy
  next.gdp -= rateDifference * 1.5;

  // Higher rates reduce inflation
  next.inflation -= rateDifference * 0.15;

  // Higher rates can increase unemployment
  next.unemployment += rateDifference * 0.08;
}