export type MarketStructure =
  | "Perfect Competition"
  | "Monopolistic Competition"
  | "Oligopoly"
  | "Monopoly";

export interface Market {
  name: string;

  structure: MarketStructure;

  baseDemand: number;

  priceElasticity: number;

  marketSize: number;

  averageMarketPrice: number;
}