import { Box, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Intro: React.FC = () => {
  console.log("holaaa");
  const navigate = useNavigate();
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading as="h2" size="2xl" noOfLines={1}>
        German Drills
      </Heading>
      <Button onClick={() => navigate("/wech-akk-dat")}>Akk Wech Dat</Button>
    </Box>
  );
};
