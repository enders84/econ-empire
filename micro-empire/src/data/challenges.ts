import type { Challenge } from "../models/Challenge";

export const challenges: Challenge[] = [
  {
    id: "perfect-competition-profit-max",
    title: "Find the Competitive Output",
    description:
      "Adjust production until price is approximately equal to marginal cost. In perfect competition, the profit-maximizing firm produces where P = MR = MC.",
    marketStructure:
      "Perfect Competition",
    status: "Not Started",
    successMessage:
      "Excellent. You found the competitive firm's profit-maximizing output where P ≈ MR ≈ MC.",
  },

  {
    id: "monopolistic-entry",
    title: "Experience Market Entry",
    description:
      "Earn positive economic profit and observe how profits attract new differentiated competitors into the market.",
    marketStructure:
      "Monopolistic Competition",
    status: "Not Started",
    successMessage:
      "New competitors entered the market. Your economic profit attracted entry, increasing substitutes and shifting demand for your firm inward.",
  },

  {
    id: "oligopoly-strategy",
    title: "Compete Without a Price War",
    description:
      "Create a positive strategic demand advantage while keeping price-war pressure below 2.0.",
    marketStructure:
      "Oligopoly",
    status: "Not Started",
    successMessage:
      "You gained a strategic demand advantage without triggering a price war. Oligopoly decisions depend on how rival firms respond.",
  },

  {
    id: "monopoly-profit-max",
    title: "Find the Monopoly Output",
    description:
      "Adjust production until marginal revenue is approximately equal to marginal cost.",
    marketStructure:
      "Monopoly",
    status: "Not Started",
    successMessage:
      "Excellent. You found the monopoly profit-maximizing output where MR ≈ MC. The corresponding price is determined from the market demand curve.",
  },
];