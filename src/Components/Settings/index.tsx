import { Button, Card, Grid, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import StaticServices from "../../services";
import { actions } from "../../store/actions";
import { saveJiraDomainUrl } from "../../store/thunks/settingsThunks";

function WorkLog() {
    const dispatch = useAppDispatch();
    const jiraDomainUrl = useAppSelector(state => state.settings.jiraDomainUrl)
    const [jiraUrl, setJiraUrl] = useState<string>(jiraDomainUrl)
    const location = useLocation<any>();
    useEffect(() => {
        dispatch(actions.mainMenu.setHeaderTitle("Settings"))
    }, [dispatch])
    useEffect(() => {
        setJiraUrl(jiraUrl)
    }, [jiraDomainUrl]);

    const saveJiraSetup = () => {
        if (jiraDomainUrl !== jiraUrl) {
            StaticServices.JiraRestApiService.setJiraDomainUrl(jiraUrl)
            StaticServices.JiraRestApiService.fetchCurrentUser()
                .then(res => {
                    if (res.email) {
                        dispatch(saveJiraDomainUrl(jiraUrl))
                            .then(r => StaticServices.JiraRestApiService.setJiraCurrentUser(res.email))
                    }
                }).catch(err => {
                    StaticServices.JiraRestApiService.setJiraDomainUrl(jiraDomainUrl)
                })
        }
    }
    return (
        <Card style={{ padding: 10 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Jira Domain Url"
                        value={jiraUrl}
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setJiraUrl(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>{location.state && location.state.errorConnect && <Alert severity="error">Unable to connect to Jira URL. Probably you have logged out from Jira (re-login to Jira and reload this page) or the provide a working Jira url.</Alert>}</Grid>
                <Grid item xs={6} style={{marginTop: 10}}>
                    <Button fullWidth onClick={() => saveJiraSetup()} variant="contained" color="primary">Save</Button>
                </Grid>
            </Grid>
        </Card>
    );
}

export default WorkLog;
