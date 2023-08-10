import { useLocalStorage } from "./useLocalStorage";
import { useStoredCounter } from "./useStoredCounter";

/**
 * Extends regular `storedCounter` with a max streak counter, in a persistent way.
 * @returns A streak counter, a max streak counter and functions to perform actions on the streak counter
 */
export const useStreak = () => {
  const { increment, reset, counter: currentStreak } = useStoredCounter();

  const [maxStreak, setMaxStreak] = useLocalStorage(
    "maxStreak",
    (stringifiedValue) => parseInt(stringifiedValue ?? "0", 10)
  );

  function incrementStreak() {
    currentStreak &&
      currentStreak + 1 > maxStreak &&
      setMaxStreak(currentStreak + 1);
    increment();
  }

  return { increment: incrementStreak, reset, maxStreak, currentStreak };
};
