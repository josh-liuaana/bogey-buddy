export const clubs = [
  "Driver",
  "3 Wood",
  "3 Hybrid",
  "4i",
  "5i",
  "6i",
  "7i",
  "8i",
  "9i",
  "PW",
  "50°",
  "56°",
  "60°",
  "Putter",
] as const;

export type Club = (typeof clubs)[number];
