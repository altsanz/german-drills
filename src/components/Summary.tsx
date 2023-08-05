import { Box, Heading } from "@chakra-ui/react";
import React from "react";

export const Summary: React.FC<{ stats: { right: number; wrong: number } }> = ({
  stats,
}) => {
  return (
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
  );
};
