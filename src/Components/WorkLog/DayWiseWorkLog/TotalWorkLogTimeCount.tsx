import { createStyles, Grid, lighten, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { useAppSelector } from "../../../hooks/storeHooks";
import { JiraDateTimeFormat, dayWiseWorkLogDateFormat } from "../../../utils/dateUtils";
import JiraTimeView from "../../BasicComponents/JiraTimeView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            textAlign: "center",
            padding: 20,
            // fontWeight: "bolder",
            fontSize: 20
        },
        label: {
            // fontWeight: "bolder",
            // fontSize: 16
        },
        root: {
            padding: 10
        },
        resume: {
            background: lighten(theme.palette.primary.light, 0.50)
        }
    })
)

export function TotalWorkLogTimeCount() {
    const pendingWorkLogs = useAppSelector(state => state.workLog.pendingWorkLog);
    const workLogs = useAppSelector(state => state.workLog.submittedWorkLogs);
    const date = useAppSelector(state => state.workLog.dayWiseWorkLogDate)
    const styles = useStyles()

    const totalSubmitted = workLogs.filter(r => moment(r.started, JiraDateTimeFormat).format(dayWiseWorkLogDateFormat) === date)
        .map(r => r.timeSpentSeconds).reduce((r, a) => r + a, 0)

    const totalPending = pendingWorkLogs.filter(r => moment(r.started, JiraDateTimeFormat).format(dayWiseWorkLogDateFormat) === date)
        .map(r => r.timeSpentSeconds)
        .reduce((r, a) => r + a, 0);

    const resumed = pendingWorkLogs.filter(r => moment(r.started, JiraDateTimeFormat).format(dayWiseWorkLogDateFormat) === date).find(r => !!r.resumed)?.resumed
    const total = totalSubmitted + totalPending

    return <Grid container spacing={2} className={styles.root}>
        <Grid item xs={4}>
            <Paper elevation={3} className={styles.paper}>
                <Typography className={styles.label}>Submitted</Typography>
                <JiraTimeView timeSpendInSeconds={totalSubmitted} />
            </Paper>
        </Grid>
        <Grid item xs={4}>
            <Paper elevation={3} className={`${styles.paper} ${resumed ? styles.resume: ""}`}>
                <Typography className={styles.label}>Pending</Typography>
                <JiraTimeView timeSpendInSeconds={totalPending} resumed={resumed} />
            </Paper>
        </Grid>
        <Grid item xs={4}>
            <Paper elevation={3} className={styles.paper}>
                <Typography className={styles.label}>Total</Typography>
                <JiraTimeView timeSpendInSeconds={total} resumed={resumed} />
            </Paper>
        </Grid>
    </Grid>
}