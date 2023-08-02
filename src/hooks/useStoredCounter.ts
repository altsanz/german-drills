import { useLocalStorage } from "./useLocalStorage";

export const useStoredCounter = () => {
  return useLocalStorage("counter");
};
