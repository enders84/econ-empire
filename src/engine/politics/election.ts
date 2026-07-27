import type { GameState } from "../../models/GameState";
import type { ElectionResult } from "../../models/Election";

const ELECTION_THRESHOLDS = {
  landslide: 60,
  win: 50,
  tossUp: 45,
} as const;

export function holdElection(
  economy: GameState,
  random: () => number = Math.random
): ElectionResult {
  const approval = economy.approval;

  if (approval >= ELECTION_THRESHOLDS.landslide) {
    return {
      playerWon: true,
      message:
        "Landslide Victory! The public strongly supports your leadership.",
    };
  }

  if (approval >= ELECTION_THRESHOLDS.win) {
    return {
      playerWon: true,
      message: "You narrowly won reelection.",
    };
  }

  if (approval >= ELECTION_THRESHOLDS.tossUp) {
    const playerWon = random() < 0.5;

    return {
      playerWon,
      message: playerWon
        ? "You narrowly won a very close election."
        : "You narrowly lost a very close election.",
    };
  }

  return {
    playerWon: false,
    message: "The voters elected a new government.",
  };
}