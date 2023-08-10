import { Box, Button, Heading } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [devModeClicksCount, setDevModeClicksCount] = React.useState(0);
  React.useEffect(() => {
    if (devModeClicksCount >= 5) {
      navigate("/dev-mode");
    }
  }, [devModeClicksCount, navigate]);
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
        <span onClick={() => setDevModeClicksCount((prev) => prev + 1)}>
          German Drills
        </span>
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
