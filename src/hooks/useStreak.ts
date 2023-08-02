import { useLocalStorage } from "./useLocalStorage";
import { useStoredCounter } from "./useStoredCounter";

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
