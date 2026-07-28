export interface ElectionResult {
  winner: "player" | "opposition";

  voteShare: number;

  approval: number;

  message: string;
}