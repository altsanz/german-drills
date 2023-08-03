import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Intro } from "./pages/Intro";
import WechAkkDat from "./pages/WechAkkDat";
function App() {
  return (
    <Container height={"100%"}>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/wech-akk-dat" element={<WechAkkDat />} />
      </Routes>
    </Container>
  );
}

export default App;
