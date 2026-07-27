export type DifficultyId =
  | "student"
  | "economist"
  | "president"
  | "impossible";

export interface DifficultyOption {
  id: DifficultyId;
  label: string;
  description: string;
}

export const difficulties: readonly DifficultyOption[] = [
  {
    id: "student",
    label: "Student",
    description: "More forgiving economic conditions.",
  },
  {
    id: "economist",
    label: "Economist",
    description: "Balanced economic challenges.",
  },
  {
    id: "president",
    label: "President",
    description: "Stronger penalties for poor decisions.",
  },
  {
    id: "impossible",
    label: "Impossible",
    description: "Severe economic and political pressure.",
  },
];