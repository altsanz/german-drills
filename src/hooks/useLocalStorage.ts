export const useLocalStorage = (
  key: string
): [string | null, (value: string) => void] => {
  function setLocalStorage(value: string) {
    localStorage.setItem(key, value);
  }
  return [localStorage.getItem(key), setLocalStorage];
};
