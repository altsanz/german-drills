export const useLocalStorage = <T>(
  key: string,
  parse: (stringifiedValue: string | null) => T,
  serializer: (value: T) => string = JSON.stringify
): [T, (value: T) => void] => {
  function setLocalStorage(value: T) {
    localStorage.setItem(key, serializer(value));
  }
  return [parse(localStorage.getItem(key)), setLocalStorage];
};
