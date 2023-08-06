export type Mode = "akk" | "dat";

export type Preposition = {
  preposition: string;
  mode: Mode | "wechsel";
};

export interface FixedPreposition extends Preposition {
  mode: Mode;
}

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

export const prepositionsWithoutWechsel: ReadonlyArray<FixedPreposition> = [
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

export const pronounsByMode: Record<Mode, ReadonlyArray<string>> = {
  akk: ["mich", "dich", "ihn", "es", "sie", "uns", "euch", "sie"],
  dat: ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"],
};

export const articlesByMode: Record<Mode, ReadonlyArray<string>> = {
  akk: ["einen", "ein", "eine", "den", "die", "das", "ihren", "ihres", "ihre"],
  dat: [
    "einem",
    "einer",
    "einen",
    "dem",
    "der",
    "den",
    "ihrem",
    "ihrer",
    "ihren",
  ],
};
