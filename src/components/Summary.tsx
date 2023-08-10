import { Box, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Summary: React.FC<{ stats: { right: number; wrong: number } }> = ({
  stats,
}) => {
  const navigate = useNavigate();
  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Box
        style={{
          height: "80%",
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
        }}
      >
        <Heading as="h2" size="4xl">
          {stats.right}
        </Heading>
        <Heading as="h2" size="3xl">
          /{stats.right + stats.wrong}
        </Heading>
      </Box>
      <ButtonGroup>
        <Button onClick={() => navigate("..", { relative: "path" })}>
          Again
        </Button>
        <Button onClick={() => navigate("/")}>Home</Button>
      </ButtonGroup>
    </Box>
  );
};
