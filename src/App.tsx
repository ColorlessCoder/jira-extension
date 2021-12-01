import React, { useEffect, useState } from "react";
import {
  HashRouter as Router
} from "react-router-dom";
import MainMenu from "./Components/MainMenu/index";

function App() {
  return (
    <Router>
      <MainMenu />
    </Router>
  );
}

export default App;