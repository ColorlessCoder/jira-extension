import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import moment from "moment";
import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/storeHooks";
import { uploadPendingWorkLog } from "../../store/thunks/workLogThunks";
import { PendingWorkLogInt } from "../../types";
import { JiraDateTimeFormat, TimeFormatForView } from "../../utils/dateUtils";
import { addRemainingSecondsToRound, convertJiraCommentToText, convertTimeInSecondToJiraTimeFormat } from "../../utils/jiraUtils";
import EnhancedTable from "../BasicComponents/EnhancedTable";
import JiraTimeView from "../BasicComponents/JiraTimeView";

export default function PublishWorkLogs({ workLogs, onClose }: { workLogs: PendingWorkLogInt[], onClose: () => any }) {
    const dispatch = useAppDispatch();
    const [submitEnabled, setSubmitEnabled] = useState(true)
    const totalTimeInSeconds = workLogs.map(r => addRemainingSecondsToRound(r.timeSpentSeconds))
        .reduce((t, r) => t + r, 0)
    const publish = () => {
        if(submitEnabled) {
            setSubmitEnabled(false);
            let promises: Promise<any>[] = []
            workLogs.forEach(r => promises.push(dispatch(uploadPendingWorkLog(r))))
            Promise.all(promises).then(() => onClose()).catch(err => console.error(err))
        }
    }

    return <Dialog open={true} aria-labelledby="form-dialog-title" maxWidth="lg">
        <DialogTitle id="form-dialog-title">Upload Work Logs: {convertTimeInSecondToJiraTimeFormat(totalTimeInSeconds).text}</DialogTitle>
        <DialogContent>
            <EnhancedTable
                data={workLogs}
                getRowKey={(r) => r.id}
                selection={{
                    mode: "none",
                    by: "checkbox"
                }}
                columns={[
                    { id: "issueKey", numeric: false, disablePadding: false, label: 'Issue', align: "left" },
                    {
                        id: "started", numeric: false, disablePadding: false, label: 'Started', align: "left",
                        renderColumn: (r) => moment(r.started, JiraDateTimeFormat).format(TimeFormatForView)
                    },
                    {
                        id: "timeSpentSeconds", numeric: false, disablePadding: false, label: 'Time Spent', align: "left",
                        renderColumn: (r) => <JiraTimeView timeSpendInSeconds={r.timeSpentSeconds} resumed={r.resumed} roundSeconds/>,
                        descendingComparator: (a: any, b: any) => a>b ? -1: (a===b ? 0: 1)
                    },
                    {
                        id: "comment", numeric: true, disablePadding: false, label: 'Comments', align: "left", disableSorting: true,
                        renderColumn: (r) => convertJiraCommentToText(r.comment)
                    },
                ]}
                sorting={{
                    defaultSorting: "started",
                    defaultSortingOrder: "desc"
                }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => publish()} disabled={!submitEnabled} color="primary" variant="contained">Submit</Button>
            <Button onClick={() => onClose()} color="secondary">Cancel</Button>
        </DialogActions>
    </Dialog>
}