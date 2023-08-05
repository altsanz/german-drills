export type Preposition = {
  preposition: string;
  mode: "akk" | "dat" | "wechsel";
};
export type Prepositions = ReadonlyArray<Preposition>;
export const prepositions: Prepositions = [
  {
    preposition: "bis",
    mode: "akk",
  },
  {
    preposition: "durch",
    mode: "akk",
  },
  {
    preposition: "für",
    mode: "akk",
  },
  {
    preposition: "gegen",
    mode: "akk",
  },
  {
    preposition: "ohne",
    mode: "akk",
  },
  {
    preposition: "um",
    mode: "akk",
  },
  { preposition: "an", mode: "wechsel" },
  { preposition: "auf", mode: "wechsel" },
  // { preposition: "entlang", mode: "wechsel" },
  { preposition: "hinter", mode: "wechsel" },
  { preposition: "in", mode: "wechsel" },
  { preposition: "neben", mode: "wechsel" },
  { preposition: "über", mode: "wechsel" },
  { preposition: "unter", mode: "wechsel" },
  { preposition: "vor", mode: "wechsel" },
  { preposition: "zwischen", mode: "wechsel" },
  { preposition: "aus", mode: "dat" },
  { preposition: "ausser", mode: "dat" },
  { preposition: "bei", mode: "dat" },
  // { preposition: "gegenüber", mode: "dat" },
  { preposition: "mit", mode: "dat" },
  { preposition: "nach", mode: "dat" },
  { preposition: "seit", mode: "dat" },
  { preposition: "von", mode: "dat" },
  { preposition: "zu", mode: "dat" },
];

export const prepositionsWithoutWechsel: ReadonlyArray<{
  preposition: string;
  mode: "akk" | "dat";
}> = [
  {
    preposition: "bis",
    mode: "akk",
  },
  {
    preposition: "durch",
    mode: "akk",
  },
  {
    preposition: "für",
    mode: "akk",
  },
  {
    preposition: "gegen",
    mode: "akk",
  },
  {
    preposition: "ohne",
    mode: "akk",
  },
  {
    preposition: "um",
    mode: "akk",
  },

  { preposition: "aus", mode: "dat" },
  { preposition: "ausser", mode: "dat" },
  { preposition: "bei", mode: "dat" },
  // { preposition: "gegenüber", mode: "dat" },
  { preposition: "mit", mode: "dat" },
  { preposition: "nach", mode: "dat" },
  { preposition: "seit", mode: "dat" },
  { preposition: "von", mode: "dat" },
  { preposition: "zu", mode: "dat" },
];

export const validPronounsForMode: Record<
  "akk" | "dat",
  ReadonlyArray<string>
> = {
  akk: ["einen", "ein", "eine", "den", "die", "das"],
  dat: ["einem", "einer", "einen", "dem", "der", "den"],
};
