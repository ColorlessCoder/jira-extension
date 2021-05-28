import classes from "*.module.css";
import { Accordion, AccordionDetails, AccordionSummary, createStyles, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import { ExpandMoreRounded } from "@material-ui/icons";
import React from "react";
import { Header } from "./Header";
import { PendingWorkLogList } from "./PendingWorkLogList";
import { SubmittedWorkLog } from "./SubmittedWorkLogList";
import { TotalWorkLogTimeCount } from "./TotalWorkLogTimeCount";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        noBefore: {
            marginTop: 10,
            '&::before': {
                // background: "none",
            }
        }
    })
);

export function DayWiseWorkLog() {
    const styles = useStyles();
    return <Paper style={{ padding: 10}} elevation={0}>
        <Header />
        <hr style={{marginBottom: 10}}/>
        <TotalWorkLogTimeCount />
        <Accordion defaultExpanded elevation={3}>
            <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                aria-controls="pending-work-log-accord-content"
                id="pending-work-log-accord-header"
            >
                <Typography variant="h6">Pending Work Log</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <PendingWorkLogList />
            </AccordionDetails>
        </Accordion>
        <Accordion className={styles.noBefore} elevation={3}>
            <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                aria-controls="pending-work-log-accord-content"
                id="pending-work-log-accord-header"
            >
                <Typography variant="h6">Submitted Work Log</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <SubmittedWorkLog />
            </AccordionDetails>
        </Accordion>
    </Paper>
}