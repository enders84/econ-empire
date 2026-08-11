import type { CountryId } from "../models/Country";

export const tradePartners: Record<
  CountryId,
  CountryId[]
> = {
  "united-states": [
    "canada",
    "mexico",
    "china",
    "japan",
    "germany",
    "south-korea",
  ],

  china: [
    "united-states",
    "japan",
    "south-korea",
    "germany",
    "australia",
  ],

  japan: [
    "united-states",
    "china",
    "south-korea",
    "australia",
  ],

  germany: [
    "france",
    "united-kingdom",
    "united-states",
    "china",
  ],

  india: [
    "united-states",
    "china",
    "united-kingdom",
    "australia",
  ],

  "united-kingdom": [
    "united-states",
    "germany",
    "france",
    "canada",
    "india",
  ],

  france: [
    "germany",
    "united-kingdom",
    "united-states",
    "canada",
  ],

  canada: [
    "united-states",
    "mexico",
    "united-kingdom",
  ],

  mexico: [
    "united-states",
    "canada",
    "china",
  ],

  brazil: [
    "china",
    "united-states",
    "canada",
  ],

  australia: [
    "china",
    "japan",
    "south-korea",
    "india",
  ],

  "south-korea": [
    "china",
    "united-states",
    "japan",
    "australia",
  ],
};