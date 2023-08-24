import { Container, Heading } from "@chakra-ui/react";
import React from "react";
import ReactJson from "react-json-view";

const DevMode: React.FC = () => {
  const wechAkkDatJSON = React.useMemo(
    () => JSON.parse(localStorage.getItem("wech-akk-dat") ?? "{}"),
    []
  );

  const wechAkkDatTurboJSON = React.useMemo(
    () => JSON.parse(localStorage.getItem("wech-akk-dat-turbo") ?? "{}"),
    []
  );
  const prepAndPronJSON = React.useMemo(
    () => JSON.parse(localStorage.getItem("prep-and-pron") ?? "{}"),
    []
  );

  return (
    <Container height={"100%"}>
      <Heading as="h2" marginY={5} size="1xl">
        wech-akk-dat
      </Heading>
      <ReactJson src={wechAkkDatJSON} />
      <Heading as="h2" marginY={5} size="1xl">
        wechAkkDatTurboJSON
      </Heading>
      <ReactJson src={wechAkkDatTurboJSON} />
      <Heading as="h2" marginY={5} size="1xl">
      prepAndPronJSON
      </Heading>
      <ReactJson src={prepAndPronJSON} />

      <pre>{}</pre>
    </Container>
  );
};

export default DevMode;
