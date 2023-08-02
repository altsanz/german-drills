import { useLocalStorage } from "./useLocalStorage";

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
