import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Fade,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
// import "../App.css";
import { Lens } from "@atomic-object/lenses";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Summary } from "../components/Summary";
import {
  Preposition,
  Prepositions,
  prepositions,
} from "../consts/prepositions";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useStreak } from "../hooks/useStreak";

// const PREPOSITIONS_PER_ROUND = 2;
function WechAkkDat() {
  const { incrementRight, incrementWrong, stats } = useStats("wech-akk-dat");
  const navigate = useNavigate();
  useEffect(() => {
    // stats.right + stats.wrong >= PREPOSITIONS_PER_ROUND && navigate("./final");
  }, [navigate, stats.right, stats.wrong]);
  const [show, setShow] = React.useState(true);
  const { preposition, nextPreposition } = usePreposition(prepositions);
  const [right, setRight] = React.useState<boolean | null>(null);
  const {
    increment: incrementStreak,
    reset: resetStreak,
    currentStreak,
    maxStreak,
  } = useStreak();
  const [response, setResponse] = React.useState<"akk" | "dat" | "wechsel">();
  React.useEffect(() => {
    if (response) {
      const responseIsCorrect = response === preposition.mode;
      setRight(responseIsCorrect);
      setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          nextPreposition();
          setRight(null);
          setResponse(undefined);
          if (responseIsCorrect) {
            incrementStreak();
            incrementRight();
          } else {
            incrementWrong();
            resetStreak();
          }
          setShow(true);
        }, 200);
      }, 1800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <Container height={"100%"}>
      <Routes>
        <Route
          path="/"
          element={
            <Game
              response={response}
              right={right}
              preposition={preposition}
              currentStreak={currentStreak}
              maxStreak={maxStreak}
              show={show}
              onResponse={setResponse}
            />
          }
        />
        <Route path="/final" element={<Summary stats={stats} />} />
      </Routes>
    </Container>
  );
}

export default WechAkkDat;

const usePreposition = (
  prepositions: Prepositions
): {
  preposition: Preposition;
  nextPreposition(): void;
} => {
  const getRandomPreposition = () =>
    prepositions[Math.trunc(Math.random() * prepositions.length)];

  const [preposition, setPreposition] = React.useState<Preposition>(
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

type DailyStat = {
  right: number;
  wrong: number;
  averageResponseTime: number;
};
const aStat = (stat: JsonParsed): DailyStat => {
  try {
    return {
      averageResponseTime: stat.averageResponseTime,
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
const averageResponseTimeStatLens = todayStatLens.comp(
  Lens.from<DailyStat>().prop("averageResponseTime")
);

const useStats = (drill: string) => {
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
        averageResponseTimeStatLens.set(
          incrementedDrillStats,
          (todaysDrillStats.averageResponseTime + elapsedTime) / 2
        )
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
        averageResponseTimeStatLens.set(
          incrementedDrillStats,
          (todaysDrillStats.averageResponseTime + elapsedTime) / 2
        )
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

const Game: React.FC<{
  response: "akk" | "dat" | "wechsel" | undefined;
  right: boolean | null;
  preposition: Preposition;
  currentStreak: number;
  maxStreak: number;
  show: boolean;
  onResponse: (response: "akk" | "dat" | "wechsel") => void;
}> = ({
  response,
  right,
  preposition,
  currentStreak,
  maxStreak,
  show,
  onResponse,
}) => {
  const answerColor =
    right === null ? "blackAlpha.800" : right ? "green.400" : "red.400";
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      style={{
        alignItems: "center",
      }}
    >
      <Box
        flexGrow={0}
        marginTop={"2"}
        display={"flex"}
        flexDirection={"column"}
        alignSelf={"flex-end"}
        alignItems={"flex-end"}
      >
        <Heading as="h6" color={"gray.400"} size="xs">
          Current streak: {currentStreak}
        </Heading>
        <Heading as="h6" color={"gray.400"} size="xs">
          Record streak: {maxStreak}
        </Heading>
      </Box>
      <Box
        flexGrow={1}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box>
          <Fade in={show}>
            <Heading size="4xl" color={answerColor}>
              {preposition.preposition}
            </Heading>
          </Fade>
        </Box>
      </Box>
      <Box
        style={{
          position: "fixed",
          bottom: 0,
          paddingBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
        flexGrow={0}
      >
        <ButtonGroup>
          <Button
            colorScheme={getButtonColorScheme(
              "akk",
              response,
              right,
              preposition.mode
            )}
            onClick={() => onResponse("akk")}
          >
            Akk
          </Button>
          <Button
            colorScheme={getButtonColorScheme(
              "wechsel",
              response,
              right,
              preposition.mode
            )}
            onClick={() => onResponse("wechsel")}
          >
            Wechsel
          </Button>
          <Button
            colorScheme={getButtonColorScheme(
              "dat",
              response,
              right,
              preposition.mode
            )}
            onClick={() => onResponse("dat")}
          >
            Dat
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

const getButtonColorScheme = (
  buttonValue: Preposition["mode"],
  response: "akk" | "dat" | "wechsel" | undefined,
  right: boolean | null,
  rightAnswer: Preposition["mode"]
): "gray" | "green" | "red" => {
  const didNotReplied = right === null;
  if (didNotReplied) return "gray";
  if (buttonValue === rightAnswer) return "green";

  const userRepliedThis = buttonValue === response;
  if (!right && userRepliedThis) return "red";
  return "gray";
};
