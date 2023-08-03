import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Fade,
  Heading,
} from "@chakra-ui/react";
import React from "react";
// import "../App.css";
import { useStreak } from "../hooks/useStreak";

type Preposition = {
  preposition: string;
  mode: "akk" | "dat" | "wechsel";
};

type Prepositions = ReadonlyArray<Preposition>;

const prepositions: Prepositions = [
  {
    preposition: "bis",
    mode: "akk",
  },
  {
    preposition: "durch",
    mode: "akk",
  },
  {
    preposition: "für",
    mode: "akk",
  },
  {
    preposition: "gegen",
    mode: "akk",
  },
  {
    preposition: "ohne",
    mode: "akk",
  },
  {
    preposition: "um",
    mode: "akk",
  },
  { preposition: "an", mode: "wechsel" },
  { preposition: "auf", mode: "wechsel" },
  // { preposition: "entlang", mode: "wechsel" },
  { preposition: "hinter", mode: "wechsel" },
  { preposition: "in", mode: "wechsel" },
  { preposition: "neben", mode: "wechsel" },
  { preposition: "über", mode: "wechsel" },
  { preposition: "unter", mode: "wechsel" },
  { preposition: "vor", mode: "wechsel" },
  { preposition: "zwischen", mode: "wechsel" },
  { preposition: "aus", mode: "dat" },
  { preposition: "ausser", mode: "dat" },
  { preposition: "bei", mode: "dat" },
  // { preposition: "gegenüber", mode: "dat" },
  { preposition: "mit", mode: "dat" },
  { preposition: "nach", mode: "dat" },
  { preposition: "seit", mode: "dat" },
  { preposition: "von", mode: "dat" },
  { preposition: "zu", mode: "dat" },
];
function WechAkkDat() {
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
          } else {
            resetStreak();
          }
          setShow(true);
        }, 200);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const answerColor =
    right === null ? "blackAlpha.800" : right ? "green.400" : "red.400";

  const getButtonColorScheme = (buttonValue: Preposition["mode"]) => {
    if (right === null) return "gray";
    if (buttonValue === preposition.mode) return "green";

    if (!right && buttonValue === response) return "red";
    return "gray";
  };
  return (
    <Container height={"100%"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        style={{ alignItems: "center" }}
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
              colorScheme={getButtonColorScheme("akk")}
              onClick={() => setResponse("akk")}
            >
              Akk
            </Button>
            <Button
              colorScheme={getButtonColorScheme("wechsel")}
              onClick={() => setResponse("wechsel")}
            >
              Wechsel
            </Button>
            <Button
              colorScheme={getButtonColorScheme("dat")}
              onClick={() => setResponse("dat")}
            >
              Dat
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
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
