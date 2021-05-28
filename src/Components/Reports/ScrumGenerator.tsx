import { Grid, IconButton, TextField } from "@material-ui/core"
import { JiraWorkLogInt } from "../../types"
import { convertJiraCommentToText } from "../../utils/jiraUtils";
import lodash from 'lodash'
import StaticServices from "../../services";
import { useStore } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { loadWorkLogsByDate } from "../../store/thunks/workLogThunks";
import { areSameDate, dayWiseWorkLogDateFormat, JiraDateTimeFormat } from "../../utils/dateUtils";
import { FileCopy } from "@material-ui/icons";

function processWorkLogForScum(workLog: JiraWorkLogInt, issue?: any) {
    let comment = convertJiraCommentToText(workLog.comment)
    let probableMyIssue = (lodash.get(issue, "customfield_10901.emailAddress", StaticServices.JiraRestApiService.getJiraCurrentUser()) as unknown as string) === StaticServices.JiraRestApiService.getJiraCurrentUser()
    let isCommon = ["scrum", "status update", "weekly", "leave"].filter(r => comment.toLowerCase().indexOf(r) >= 0).length > 0
    let isReview = ["review code", "review of"].filter(r => comment.toLowerCase().indexOf(r) >= 0).length > 0
    let isImplementation = (["implement", "fix", "develop"].filter(r => comment.toLowerCase().indexOf(r) >= 0).length > 0) && probableMyIssue
    let isComplete = ["complete"].filter(r => comment.toLowerCase().indexOf(r) >= 0).length > 0
    let isAnalysis = (["analysis", "report"].filter(r => comment.toLowerCase().indexOf(r) >= 0).length > 0) && probableMyIssue
    let isDiscussion = ["discussion", "meeting"].filter(r => comment.toLowerCase().indexOf(r) >= 0).length > 0
    if(isCommon) {
        comment = ""
    } else if (isReview || isComplete) {
        comment = workLog.issueKey + ": " + comment
    } else if (isImplementation) {
        comment = workLog.issueKey + ": Implementation - " + comment
    } else if (isAnalysis) {
        comment = workLog.issueKey + ": Analysis - " + comment
    } else if (isDiscussion && workLog.timeSpentSeconds >= (30*60)) {
        comment = workLog.issueKey + ": Communication - " + comment
    } else {
        comment = ""
    }
    return comment.split("\n").join(" ")
}

export default function ScrumGenerator() {
    const currentDate = moment().format(dayWiseWorkLogDateFormat);
    const previousDay = moment().subtract(1, "day").format(dayWiseWorkLogDateFormat);
    const dispatch = useAppDispatch();
    const datesForWhichWorkLogsLoaded = useAppSelector(state => state.workLog.datesForWhichWorkLogsLoaded);
    const workLogs = useAppSelector(state => state.workLog.submittedWorkLogs);
    const pendingWorkLogs = useAppSelector(state => state.workLog.pendingWorkLog);
    const [worked, setWorked] = useState<string>("N/A")
    const [plan, setPlan] = useState<string>("N/A")
    useEffect(() => {
        if(datesForWhichWorkLogsLoaded.indexOf(previousDay) < 0) {
            dispatch(loadWorkLogsByDate(moment(previousDay).toDate()));
        } else {
            let comments = workLogs
                .filter(r => areSameDate(moment(previousDay, dayWiseWorkLogDateFormat).toDate(), moment(r.started, JiraDateTimeFormat).toDate(), dayWiseWorkLogDateFormat))
                .map(r => processWorkLogForScum(r))
                .filter(r => !!r)
                .join("\n")
            setWorked(comments? comments: "N/A");
        }
    }, [datesForWhichWorkLogsLoaded, dispatch, previousDay, workLogs]);

    useEffect(() => {
        let comments = pendingWorkLogs
                .filter(r => areSameDate(moment(currentDate, dayWiseWorkLogDateFormat).toDate(), moment(r.started, JiraDateTimeFormat).toDate(), dayWiseWorkLogDateFormat))
                .map(r => processWorkLogForScum(r))
                .filter(r => !!r)
                .join("\n")
            setPlan(comments? comments: "N/A");
    }, [pendingWorkLogs])

    return <Grid container style={{padding: 10, marginTop: 30}} justify="center">
        <Grid item xs={5}>
            <TextField
                label="Worked on Yesterday"
                fullWidth
                rows={10}
                multiline
                variant="outlined"
                value={worked}
                onChange={e => setWorked(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={() => navigator.clipboard.writeText(worked)}>
                            <FileCopy/>
                        </IconButton>
                    ),
                }}
            />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
            <TextField
                label="Plan for Today"
                variant="outlined"
                fullWidth
                rows={10}
                multiline
                value={plan}
                onChange={e => setPlan(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={() => navigator.clipboard.writeText(plan)}>
                            <FileCopy/>
                        </IconButton>
                    ),
                }}
            />
        </Grid>
    </Grid>
}