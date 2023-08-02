import { Box, Button, ButtonGroup, Container, Heading } from "@chakra-ui/react";
import React from "react";
import "./App.css";

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
function App() {
  const { preposition, nextPreposition } = usePreposition(prepositions);
  const [right, setRight] = React.useState<boolean | null>(null);

  const [response, setResponse] = React.useState<"akk" | "dat" | "wechsel">();
  React.useEffect(() => {
    if (response) {
      const responseIsCorrect = response === preposition.mode;
      setRight(responseIsCorrect);
      setTimeout(() => {
        nextPreposition();
        setRight(null);
        setResponse(undefined);
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
      <Box display={"flex"} flexDirection={"column"} height={"100%"}>
        <Box
          flexGrow={0}
          marginTop={"2"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-end"}
        >
          <Heading as="h6" color={"gray.400"} size="xs">
            Current streak: 20
          </Heading>
          <Heading as="h6" color={"gray.400"} size="xs">
            Record streak: 32
          </Heading>
        </Box>
        <Box
          flexGrow={1}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box>
            <Heading size="4xl" color={answerColor}>
              {preposition.preposition}
            </Heading>
          </Box>
        </Box>
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            paddingBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
          flexGrow={0}
        >
          <ButtonGroup>
            <Button
              colorScheme={getButtonColorScheme("akk")}
              disabled={right !== null}
              onClick={() => setResponse("akk")}
            >
              Akk
            </Button>
            <Button
              colorScheme={getButtonColorScheme("wechsel")}
              disabled={right !== null}
              onClick={() => setResponse("wechsel")}
            >
              Wechsel
            </Button>
            <Button
              colorScheme={getButtonColorScheme("dat")}
              disabled={right !== null}
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

export default App;

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
