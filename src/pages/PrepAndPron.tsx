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
import { Route, Routes, useNavigate } from "react-router-dom";
import { Summary } from "../components/Summary";
import {
  Preposition,
  Prepositions,
  prepositionsWithoutWechsel,
} from "../consts/prepositions";
import { useStreak } from "../hooks/useStreak";
// const PREPOSITIONS_PER_ROUND = 2;
function PrepAndPron() {
  const { incrementRight, incrementWrong, stats } = useStats();
  const navigate = useNavigate();
  useEffect(() => {
    // stats.right + stats.wrong >= PREPOSITIONS_PER_ROUND && navigate("./final");
  }, [navigate, stats.right, stats.wrong]);
  const [show, setShow] = React.useState(true);
  const { preposition, nextPreposition } = usePreposition(
    prepositionsWithoutWechsel
  );

  const challenge = getPrepositionWithProns(preposition);

  const [right, setRight] = React.useState<boolean | null>(null);

  // useEffect(() => {
  //   const isWechsel = preposition.mode === "wechsel";
  //   const rightAnswer = isWechsel
  //     ? validPronounsForMode[preposition.mode][
  //         Math.random() * validPronounsForMode[preposition.mode].length
  //       ]
  //     : "";
  // }, []);
  const {
    increment: incrementStreak,
    reset: resetStreak,
    currentStreak,
    maxStreak,
  } = useStreak();
  const [response, setResponse] = React.useState<string>();
  React.useEffect(() => {
    if (response) {
      const responseIsCorrect = isResponseCorrect();
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
              possibleValues={challenge.possibleProns}
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

const isResponseCorrect = () => {
  console.warn("to implement");
  return true;
};

export default PrepAndPron;

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

const useStats = () => {
  const [stats, setStats] = React.useState<{
    right: number;
    wrong: number;
  }>({
    right: 0,
    wrong: 0,
  });

  const incrementRight = () => {
    setStats((prev) => ({
      ...prev,
      right: prev.right + 1,
    }));
  };
  const incrementWrong = () => {
    setStats((prev) => ({
      ...prev,
      wrong: prev.wrong + 1,
      streak: 0,
    }));
  };

  return {
    stats,
    incrementRight,
    incrementWrong,
  };
};

const Game: React.FC<{
  response: string | undefined;
  possibleValues: [string, string, string];
  right: boolean | null;
  preposition: Preposition;
  currentStreak: number;
  maxStreak: number;
  show: boolean;
  onResponse: (response: string) => void;
}> = ({
  response,
  possibleValues,
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
          {possibleValues.map((pron) => (
            <Button
              colorScheme={getButtonColorScheme(
                pron,
                response,
                right,
                preposition.mode
              )}
              key={pron}
              onClick={() => onResponse(pron)}
            >
              {pron}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </Box>
  );
};

const getPrepositionWithProns = (
  preposition: Preposition
): {
  preposition: string;
  possibleProns: [string, string, string];
  correctPron: string;
} => {
  return {
    preposition: preposition.preposition,
    possibleProns: ["den", "dem", "der"],
    correctPron: "dem",
  };
};

const getButtonColorScheme = (
  buttonValue: string,
  response: string | undefined,
  right: boolean | null,
  rightAnswer: string
): "gray" | "green" | "red" => {
  const didNotReplied = right === null;
  if (didNotReplied) return "gray";
  if (buttonValue === rightAnswer) return "green";

  const userRepliedThis = buttonValue === response;
  if (!right && userRepliedThis) return "red";
  return "gray";
};
