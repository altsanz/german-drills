import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Intro } from "./pages/Intro";
import PrepAndPron from "./pages/PrepAndPron";
import WechAkkDat from "./pages/WechAkkDat";
function App() {
  return (
    <Container height={"100%"}>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/wech-akk-dat/*" element={<WechAkkDat />} />
        <Route path="/prep-and-pron/*" element={<PrepAndPron />} />
      </Routes>
    </Container>
  );
}

export default App;
