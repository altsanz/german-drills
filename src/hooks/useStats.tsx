import React from "react";
import { useLocalStorage } from "./useLocalStorage";

import { Lens } from "@atomic-object/lenses";

type DailyStat = {
  right: number;
  wrong: number;
  responseTimeList: ReadonlyArray<number>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonParsed = any;

type Parser<T> = (something: JsonParsed) => T;
const withObjects = <U,>(
  valueParser: Parser<U>
): Parser<{ [key: string]: U }> => {
  return (value) => {
    try {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => [key, valueParser(value)])
      );
    } catch (e) {
      throw "Invalid object";
    }
  };
};
const todayDate = new Date();

const todayFormatted = `${todayDate.getFullYear()}${
  todayDate.getMonth() + 1 < 10 ? "0" : ""
}${todayDate.getMonth() + 1}${
  todayDate.getDate() < 10 ? "0" : ""
}${todayDate.getDate()}`;

const todayStatLens = Lens.of<
  {
    [key: string]: DailyStat;
  },
  DailyStat
>({
  get: (stats) => stats[todayFormatted] ?? { right: 0, wrong: 0 },
  set: (stats, todaysStat) => ({ ...stats, [todayFormatted]: todaysStat }),
});

const wrongStatLens = todayStatLens.comp(Lens.from<DailyStat>().prop("wrong"));
const rightStatLens = todayStatLens.comp(Lens.from<DailyStat>().prop("right"));
const responseTimeListLens = todayStatLens.comp(
  Lens.from<DailyStat>().prop("responseTimeList")
);

const aStat = (stat: JsonParsed): DailyStat => {
  try {
    return {
      responseTimeList: stat.responseTimeList,
      right: stat.right,
      wrong: stat.wrong,
    };
  } catch (e) {
    throw "Invalid stat";
  }
};

const parseJSON = (data: string): JsonParsed => {
  return JSON.parse(data);
};

/**
 * Saves stats to local storage and returns a hook to access them
 * @param drill prefix for the key in local storage
 * @returns
 */
export const useStats = (drill: string) => {
  const [drillStats, setDrillStats] = useLocalStorage(`${drill}`, (list) =>
    withObjects(aStat)(parseJSON(list ?? "{}"))
  );

  const [timestampLastResponse, setTimestampLastResponse] =
    React.useState<number>(Date.now());

  const todaysDrillStats = todayStatLens(drillStats);

  const incrementRight = () => {
    const elapsedTime = Date.now() - 2000 - timestampLastResponse;
    const incrementedDrillStats = rightStatLens.set(
      drillStats,
      todaysDrillStats.right + 1
    );

    if (elapsedTime < 10000) {
      setDrillStats(
        responseTimeListLens.set(incrementedDrillStats, [
          ...(todaysDrillStats.responseTimeList ?? []),
          elapsedTime,
        ])
      );
    } else {
      setDrillStats(incrementedDrillStats);
    }

    setTimestampLastResponse(Date.now());
  };
  const incrementWrong = () => {
    const elapsedTime = Date.now() - 2000 - timestampLastResponse;

    const incrementedDrillStats = wrongStatLens.set(
      drillStats,
      todaysDrillStats.wrong + 1
    );
    if (elapsedTime < 10000) {
      setDrillStats(
        responseTimeListLens.set(incrementedDrillStats, [
          ...(todaysDrillStats.responseTimeList ?? []),
          elapsedTime,
        ])
      );
    } else {
      setDrillStats(incrementedDrillStats);
    }
  };

  return {
    stats: todaysDrillStats,
    incrementRight,
    incrementWrong,
  };
};
