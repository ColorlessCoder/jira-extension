import { Backdrop } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  HashRouter as Router, useHistory
} from "react-router-dom";
import MainMenu from "./Components/MainMenu/index";
import { useAppDispatch, useAppSelector } from "./hooks/storeHooks";
import { loadSettings } from "./store/thunks/settingsThunks";
import { loadPendingWorkLogs } from "./store/thunks/workLogThunks";

function App() {
  return (
    <Router>
      <MainMenu />
    </Router>
  );
}

export default App;