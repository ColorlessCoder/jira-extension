import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, setRef, TextField, Typography } from "@material-ui/core";
import { Clear, ErrorSharp } from "@material-ui/icons";
import * as uuid from "uuid"
import moment from "moment";
import lodash from "lodash";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { JiraIssueBasicInt, NoteInt, PendingWorkLogInt } from "../../types";
import { dayWiseWorkLogDateFormat, JiraDateTimeFormat, UiDateTimeLocalFormat } from "../../utils/dateUtils";
import { convertJiraCommentToText, convertTextToJiraComment } from "../../utils/jiraUtils";
import { JiraIssueSearch } from "../BasicComponents/JiraIssueSearch";
import { JiraTimeInput } from "../BasicComponents/JiraTimeInput";
import { addPendingWorkLog, pausePendingWorkLog, resumePendingWorkLog, updatePendingWorkLog } from "../../store/thunks/workLogThunks";
import CommentSuggestions from "../BasicComponents/CommentSuggestions";
import { Avatar } from "@material-ui/core";
import EditNotes from "./EditNotes";

export function getBlankWorkLog() {
    let workLog: PendingWorkLogInt = {
        id: uuid.v4(),
        comment: convertTextToJiraComment(""),
        started: "",
        timeSpentSeconds: 0,
        issueId: "",
        issueKey: "",
        issueSummaryText: "",
        resumed: ""
    }
    return workLog;
}

export function getBlankNote(): NoteInt {
    return {
        id: uuid.v4(),
        details: "",
        type: "Others",
        rating: null
    }
}

interface PropsType {
    workLog?: PendingWorkLogInt,
    onClose: () => any,
    issue?: JiraIssueBasicInt,
    create: boolean
}

export function EditWorkLog(props: PropsType) {
    const currentDateString = useAppSelector(state => state.workLog.dayWiseWorkLogDate);
    const dispatch = useAppDispatch();
    const calculateStartedDate = () => {
        if (props.workLog) {
            return moment(props.workLog.started, JiraDateTimeFormat).format(UiDateTimeLocalFormat);
        } else {
            const currentDate = moment(currentDateString, dayWiseWorkLogDateFormat);
            return moment().date(currentDate.date()).month(currentDate.month()).year(currentDate.year()).format(UiDateTimeLocalFormat)
        }
    }
    const [issue, setIssue] = useState<JiraIssueBasicInt | null>(props.issue ? props.issue : null)
    const [started, setStarted] = useState<string>(calculateStartedDate())
    const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(props.workLog ? props.workLog.timeSpentSeconds : 0)
    const [comment, setComment] = useState<string>(props.workLog ? convertJiraCommentToText(props.workLog.comment) : "");
    const [errorText, setErrorText] = useState<string>("");
    const [hasNotes, setHasNotes] = useState<boolean>(props.workLog && props.workLog.hasNotes ? true : false)
    const [notes, setNotes] = useState<NoteInt>(props.workLog && props.workLog.notes ? props.workLog.notes : getBlankNote())
    const resumed = props.workLog && props.workLog.resumed ? moment(props.workLog.resumed, JiraDateTimeFormat).format(UiDateTimeLocalFormat) : "";
    const [saveEnabled, setSaveEnabled] = useState<boolean>(true)
    const isNew = props.create

    const validate = () => {
        if (!issue) {
            setErrorText("Please select an issue")
            return false;
        } else if (!started) {
            setErrorText("Please select start date")
            return false;
        } else if (timeSpentSeconds < 0) {
            setErrorText("Please set a valid value in time spent field")
            return false;
        } else if (!comment) {
            setErrorText("Please enter comments")
            return false;
        }
        return true
    }

    const getUpdatedWorkLog = () => {
        const workLog = props.workLog
            ? lodash.cloneDeep(props.workLog)
            : getBlankWorkLog();
        if (issue) {
            workLog.issueId = issue.id
            workLog.issueKey = issue.key
            workLog.issueSummaryText = issue.summaryText
        }
        workLog.started = moment(started, UiDateTimeLocalFormat).format(JiraDateTimeFormat)
        workLog.timeSpentSeconds = timeSpentSeconds
        workLog.comment = convertTextToJiraComment(comment)
        workLog.hasNotes = hasNotes
        workLog.notes = notes
        return workLog
    }

    const saveWorkLog = (start?: boolean) => {
        if (validate()) {
            const workLog = getUpdatedWorkLog();
            let promise:Promise<any> = dispatch(isNew ? addPendingWorkLog(workLog) : updatePendingWorkLog(workLog))
            if (start) {
                promise = promise
                    .then(() => dispatch(pausePendingWorkLog(null)))
                    .then(() => dispatch(resumePendingWorkLog(workLog)))
            }
            promise.then(() => props.onClose())
                .catch(console.error)
        }
    }

    console.log("Time", props)

    return <Dialog open={true} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="form-dialog-title">{props.workLog ? "Edit Work Log" : "Create Work Log"}</DialogTitle>
        <DialogContent>
            <Grid container>
                <Grid item xs={12} style={{ margin: 10 }}>
                    <JiraIssueSearch initialValue={issue} onChange={(value) => setIssue(value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="space-around">
                        <Grid item xs={6} style={{ padding: 10 }}>
                            <TextField
                                fullWidth
                                label="Started at"
                                type="datetime-local"
                                value={started}
                                onChange={(e) => setStarted(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6} style={{ padding: 10 }}>
                            <TextField
                                fullWidth
                                label="Resumed at"
                                type={resumed ? "datetime-local" : "text"}
                                value={resumed}
                                disabled={true}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ margin: 10 }}>
                    <JiraTimeInput autoFocus timeInSeconds={timeSpentSeconds} onChange={(value) => { setTimeSpentSeconds(value) }} />
                </Grid>
                <Grid xs={12} style={{ margin: 10 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Comments"
                        type="text"
                        size="medium"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        multiline
                        rows={2}
                        rowsMax={6}
                    />
                </Grid>
                <Grid xs={12} style={{ margin: 10 }}>
                    <Grid container>
                        <Grid item xs={1}>
                            <Chip avatar={<Avatar><Clear /></Avatar>} label="Clear" color="secondary" variant="outlined" onClick={() => setComment("")} />
                        </Grid>
                        <Grid item xs={11}>
                            <CommentSuggestions issueKey={issue ? issue.key : ""} onClick={setComment} />
                        </Grid>
                    </Grid>
                </Grid>
                {errorText && <Grid xs={12} style={{ margin: 10, display: 'flex', flexDirection: "row" }}>
                    <ErrorSharp color="secondary" style={{ marginRight: 10 }} />
                    <Typography color="secondary">
                        {errorText}
                    </Typography>
                </Grid>}
                <Grid xs={12} style={{ margin: 10 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={hasNotes}
                                color="primary"
                                onChange={(e) => {
                                    setSaveEnabled(!e.target.checked)
                                    setHasNotes(e.target.checked)
                                }}
                            />
                        }
                        label="Add Notes"
                    />
                    {
                        hasNotes && <EditNotes note={notes} onSave={(n) => (setNotes(n), setSaveEnabled(true))} initialOnEditMode={!saveEnabled} onChange={() => setSaveEnabled(false)} />
                    }
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            {isNew && <Button onClick={() => saveWorkLog(true)} color="primary" variant="outlined" disabled={!saveEnabled}>Save and Start</Button>}
            <Button onClick={() => saveWorkLog()} color="primary" variant="contained" disabled={!saveEnabled}>Save</Button>
            <Button onClick={props.onClose} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
}