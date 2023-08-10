import { Container, Heading } from "@chakra-ui/react";
import React from "react";
import ReactJson from "react-json-view";

const DevMode: React.FC = () => {
  const myJsonObject = React.useMemo(
    () => JSON.parse(localStorage.getItem("wech-akk-dat") ?? "{}"),
    []
  );
  return (
    <Container height={"100%"}>
      <Heading as="h2" marginY={5} size="1xl">
        wech-akk-dat
      </Heading>
      <ReactJson src={myJsonObject} />

      <pre>{}</pre>
    </Container>
  );
};

export default DevMode;
