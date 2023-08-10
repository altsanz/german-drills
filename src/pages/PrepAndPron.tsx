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
  FixedPreposition,
  prepositionsWithoutWechsel,
  pronounsByMode,
} from "../consts/prepositions";
import { usePreposition } from "../hooks/usePreposition";
import { useStats } from "../hooks/useStats";
import { useStreak } from "../hooks/useStreak";
// const PREPOSITIONS_PER_ROUND = 2;
function PrepAndPron() {
  const { incrementRight, incrementWrong, stats } = useStats("prep-and-pron");
  const navigate = useNavigate();
  useEffect(() => {
    // stats.right + stats.wrong >= PREPOSITIONS_PER_ROUND && navigate("./final");
  }, [navigate, stats.right, stats.wrong]);
  const [show, setShow] = React.useState(true);
  const { preposition, nextPreposition } = usePreposition(
    prepositionsWithoutWechsel
  );

  const challenge = React.useMemo(() => withProns(preposition), [preposition]);

  const [right, setRight] = React.useState<boolean | null>(null);

  const {
    increment: incrementStreak,
    reset: resetStreak,
    currentStreak,
    maxStreak,
  } = useStreak();
  const [response, setResponse] = React.useState<string>();
  React.useEffect(() => {
    if (response) {
      const responseIsCorrect = response === challenge.correctPron;
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
              correctPron={challenge.correctPron}
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

export default PrepAndPron;

const Game: React.FC<{
  response: string | undefined;
  possibleValues: ReadonlyArray<string>;
  correctPron: string;
  right: boolean | null;
  preposition: FixedPreposition;
  currentStreak: number;
  maxStreak: number;
  show: boolean;
  onResponse: (response: string) => void;
}> = ({
  response,
  possibleValues,
  correctPron,
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
                correctPron
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

const withProns = (
  preposition: FixedPreposition
): {
  preposition: FixedPreposition;
  possibleProns: ReadonlyArray<string>;
  correctPron: string;
} => {
  const correctPron = getRandomElementFromList(
    pronounsByMode[preposition.mode]
  );
  const invalidPronounsForCurrentMode = pronounsByMode[
    preposition.mode === "akk" ? "dat" : "akk"
  ].filter((pronoun) => !pronounsByMode[preposition.mode].includes(pronoun)); // discard pronouns from other modes that are valid for this preposition

  const twoPronsOfWrongMode = Array.from({ length: 2 }, () => "").reduce<
    ReadonlyArray<string>
  >((acc) => {
    let randomPron = getRandomElementFromList(invalidPronounsForCurrentMode);
    while (acc.includes(randomPron)) {
      randomPron = getRandomElementFromList(invalidPronounsForCurrentMode);
    }
    return [...acc, randomPron];
  }, []);

  const possibleProns = [correctPron, ...twoPronsOfWrongMode].sort(
    () => Math.random() - 0.5 // shuffle them
  );

  return {
    preposition,
    possibleProns,
    correctPron,
  };
};

const getRandomElementFromList = <T,>(list: ReadonlyArray<T>): T => {
  return list[Math.trunc(Math.random() * list.length)];
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
