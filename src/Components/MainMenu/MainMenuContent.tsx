import { Route, Switch } from "react-router-dom";
import { WorkLog } from "../WorkLog"
import Settings from "../Settings"
import ScrumGenerator from "../Reports/ScrumGenerator";
export default function MainMenuContent() {
    return (
        <Switch>
            <Route path="/work-log">
                <WorkLog />
            </Route>
            <Route path="/scrum">
                <ScrumGenerator />
            </Route>
            <Route path="/settings">
                <Settings />
            </Route>
        </Switch>
    );
}