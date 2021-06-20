import { Route, Switch } from "react-router-dom";
import { WorkLog } from "../WorkLog"
import Settings from "../Settings"
import ScrumGenerator from "../Reports/ScrumGenerator";
import React from "react";
import NoteList from "../Notes/NoteList";
import Backup from "../Backup";
export default function MainMenuContent() {
    return (
        <Switch>
            <Route path="/work-log">
                <WorkLog />
            </Route>
            <Route path="/scrum">
                <ScrumGenerator />
            </Route>
            <Route path="/notes">
                <NoteList />
            </Route>
            <Route path="/settings">
                <Settings />
            </Route>
            <Route path="/backup">
                <Backup />
            </Route>
        </Switch>
    );
}