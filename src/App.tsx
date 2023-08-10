import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import DevMode from "./pages/DevMode";
import { Intro } from "./pages/Intro";
import PrepAndPron from "./pages/PrepAndPron";
import WechAkkDat from "./pages/WechAkkDat";
import WechAkkDatTurbo from "./pages/WechAkkDatTurbo";
function App() {
  return (
    <Container height={"100%"}>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/wech-akk-dat/*" element={<WechAkkDat />} />
        <Route path="/wech-akk-dat-turbo/*" element={<WechAkkDatTurbo />} />
        <Route path="/prep-and-pron/*" element={<PrepAndPron />} />
        <Route path="/dev-mode" element={<DevMode />} />
      </Routes>
    </Container>
  );
}

export default App;
