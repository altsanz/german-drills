import React from "react";
import { Preposition } from "../consts/prepositions";

/**
 * From a list of prepositions, get a random preposition and a function to get another random preposition
 * @param prepositions List of prepositions to choose from
 * @returns A preposition and a function to get another random preposition
 */
export const usePreposition = <T extends Preposition>(
  prepositions: ReadonlyArray<T>
): {
  preposition: T;
  nextPreposition(): void;
} => {
  const getRandomPreposition = () =>
    prepositions[Math.trunc(Math.random() * prepositions.length)];

  const [preposition, setPreposition] = React.useState<T>(
    getRandomPreposition()
  );
  const nextPreposition = () => {
    setPreposition(getRandomPreposition());
  };

  return {
    preposition,
    nextPreposition,
  };
};
