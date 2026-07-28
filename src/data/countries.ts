import type { CountryId } from "../models/Country";

export interface CountryOption {
  id: CountryId;
  name: string;
  flag: string;
}

export const countries: readonly CountryOption[] = [
  {
    id: "united-states",
    name: "United States",
    flag: "🇺🇸",
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
  },
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
  },
  {
    id: "south-korea",
    name: "South Korea",
    flag: "🇰🇷",
  },
];