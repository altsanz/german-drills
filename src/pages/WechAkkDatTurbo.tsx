import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  CircularProgressLabel,
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
  prepositions,
} from "../consts/prepositions";
import { useStreak } from "../hooks/useStreak";

const MILLISECONDS_TO_ANSWER = 5000;
// const PREPOSITIONS_PER_ROUND = 2;
function WechAkkDatTurbo() {
  const { incrementRight, incrementWrong, stats } = useStats();
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
  const [timeIsOut, setTimeIsOut] = React.useState(false);
  const timerRef = React.useRef<number>();

  const resetTimeout = () => {
    clearTimeout(timerRef.current);
    setTimeIsOut(false);
  };
  const reset = () => {
    setRight(null);
    setResponse(undefined);
    setShow(true);
    setTimeLeft(MILLISECONDS_TO_ANSWER);
  };
  const timeLeftRef = React.useRef<number>();
  const [timeLeft, setTimeLeft] = React.useState(MILLISECONDS_TO_ANSWER);
  React.useEffect(() => {
    timerRef.current = startTimeout(
      setTimeIsOut,
      currentStreak > 20 ? 2000 : currentStreak > 10 ? 3500 : 5000
    );
    timeLeftRef.current = startInterval(
      setTimeLeft,
      currentStreak > 20 ? 2000 : currentStreak > 10 ? 3500 : 5000
    );
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(timeLeftRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preposition]);

  React.useEffect(() => {
    if (response) {
      resetTimeout();
      const responseIsCorrect = response === preposition.mode;
      setRight(responseIsCorrect);
      setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          reset();
          if (responseIsCorrect) {
            incrementStreak();
            incrementRight();
          } else {
            incrementWrong();
            resetStreak();
          }
          nextPreposition();
        }, 200);
      }, 1800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  React.useEffect(() => {
    if (timeIsOut) {
      setTimeout(() => {
        setTimeIsOut(false);
        setShow(false);
        setTimeout(() => {
          reset();
          incrementWrong();
          resetStreak();
          nextPreposition();
        }, 200);
      }, 1800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeIsOut]);
  const showResults = timeIsOut || response !== undefined;

  return (
    <Container height={"100%"}>
      <Routes>
        <Route
          path="/"
          element={
            <Game
              showResults={showResults}
              response={response}
              right={right}
              preposition={preposition}
              currentStreak={currentStreak}
              maxStreak={maxStreak}
              show={show}
              onResponse={setResponse}
              timeToReply={MILLISECONDS_TO_ANSWER}
              timeLeft={timeLeft}
            />
          }
        />
        <Route path="/final" element={<Summary stats={stats} />} />
      </Routes>
    </Container>
  );
}

export default WechAkkDatTurbo;

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
  response: "akk" | "dat" | "wechsel" | undefined;
  right: boolean | null;
  preposition: Preposition;
  currentStreak: number;
  maxStreak: number;
  show: boolean;
  onResponse: (response: "akk" | "dat" | "wechsel") => void;
  showResults: boolean;
  timeToReply: number;
  timeLeft: number;
}> = ({
  timeToReply,
  timeLeft,
  response,
  right,
  preposition,
  currentStreak,
  maxStreak,
  show,
  onResponse,
  showResults,
}) => {
  const answerColor =
    right === null ? "blackAlpha.800" : right ? "green.400" : "red.400";

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      alignItems="center"
    >
      <Box
        flexGrow={0}
        alignSelf={"flex-end"}
        marginTop={"2"}
        display={"flex"}
        flexDirection={"column"}
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
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Fade in={show}>
          <Heading size="4xl" color={answerColor}>
            {preposition.preposition}
          </Heading>
        </Fade>
        <Fade in={!response}>
          <TimeLeftIndicator timeToReply={timeToReply} timeLeft={timeLeft} />
        </Fade>
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
              preposition.mode,
              showResults
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
              preposition.mode,
              showResults
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
              preposition.mode,
              showResults
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
  rightAnswer: Preposition["mode"],
  showResults: boolean
): "gray" | "green" | "red" | "purple" => {
  if (!showResults) return "gray";

  const userRepliedThis = buttonValue === response;
  if (!right && userRepliedThis) return "red";
  if (response === rightAnswer && userRepliedThis) return "green";
  if (response === undefined && buttonValue === rightAnswer) return "purple";
  return "gray";
};

/**
 *
 * @param timeoutDeadline number of milliseconds defining when time is out
 */
const TimeLeftIndicator: React.FC<{
  timeToReply: number;
  timeLeft: number;
}> = ({ timeToReply, timeLeft }) => {
  const progressValue = (timeLeft / timeToReply) * 100;
  return (
    <CircularProgress
      color={"gray.400"}
      value={progressValue}
      size={"40px"}
      marginTop="10px"
    >
      <CircularProgressLabel>
        {(Math.round((timeLeft / 1000) * 10) / 10).toFixed(1)}
      </CircularProgressLabel>
    </CircularProgress>
  );
};
function startTimeout(
  setTimeIsOut: React.Dispatch<React.SetStateAction<boolean>>,
  millisecondsToAnswer: number
): number {
  return setTimeout(() => {
    setTimeIsOut(true);
  }, millisecondsToAnswer);
}

function startInterval(
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>,
  millisecondsToAnswer: number
): number {
  let timeLeft = millisecondsToAnswer;
  return setInterval(() => {
    if (timeLeft > 0) {
      timeLeft = timeLeft - 100;
      setTimeLeft(timeLeft);
    }
  }, 100);
}
