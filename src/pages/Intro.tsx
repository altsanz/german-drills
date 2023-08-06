import { Box, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Intro: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "200px",
      }}
    >
      <Heading as="h2" size="2xl">
        German Drills
      </Heading>
      <Button
        style={{ marginTop: "50px" }}
        onClick={() => navigate("/wech-akk-dat")}
      >
        Akk Wech Dat
      </Button>
      <Button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/prep-and-pron")}
      >
        Prep und pron
      </Button>
      <Button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/wech-akk-dat-turbo")}
      >
        Akk Wech Dat Turbo
      </Button>
    </Box>
  );
};
