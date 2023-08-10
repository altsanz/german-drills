import { useLocalStorage } from "./useLocalStorage";

/**
 * Stores a counter in local storage and provides functions to increment and reset the counter
 * @returns A counter and functions to perform actions on the counter
 */
export const useStoredCounter = () => {
  const [counter, setCounter] = useLocalStorage("counter", (stringifiedValue) =>
    parseInt(stringifiedValue ?? "0", 10)
  );

  function incrementCounter() {
    setCounter((counter ?? 0) + 1);
  }

  function resetCounter() {
    setCounter(0);
  }

  return { increment: incrementCounter, reset: resetCounter, counter };
};
