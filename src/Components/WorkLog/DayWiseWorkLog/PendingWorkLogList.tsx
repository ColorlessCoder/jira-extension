import { makeStyles, Theme, createStyles, lighten, useTheme } from "@material-ui/core";
import { CloudUpload, Delete, Edit, Pause, PlayArrow, Publish } from "@material-ui/icons";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { deletePendingWorkLog, pausePendingWorkLog, resumePendingWorkLog } from "../../../store/thunks/workLogThunks";
import { PendingWorkLogInt } from "../../../types";
import { areSameDate, dayWiseWorkLogDateFormat, JiraDateTimeFormat, TimeFormatForView } from "../../../utils/dateUtils";
import { convertJiraCommentToText } from "../../../utils/jiraUtils";
import EnhancedTable from "../../BasicComponents/EnhancedTable";
import JiraTimeView from "../../BasicComponents/JiraTimeView";
import { EditWorkLog } from "../EditWorkLog";
import PublishWorkLogs from "../PublishWorkLogs";
export function PendingWorkLogList() {
    const theme = useTheme()
    const currentDate = useAppSelector(state => state.workLog.dayWiseWorkLogDate);
    const dispatch = useAppDispatch();
    const pendingWorkLogs = useAppSelector(state => state.workLog.pendingWorkLog);
    const [currentSelectedWorkLog, setCurrentSelectedWorkLog] = useState<PendingWorkLogInt>()
    const [selectedWorkLogsToUpload, setSelectedWorkLogsToUpload] = useState<PendingWorkLogInt[]>()
    const [pendingWorkLogsOfCurrentDate, setPendingWorkLogsOfCurrentDate] = useState<PendingWorkLogInt[]>([])
    
    useEffect(() => {
        setPendingWorkLogsOfCurrentDate(pendingWorkLogs.filter(r => areSameDate(moment(currentDate, dayWiseWorkLogDateFormat).toDate(), moment(r.started, JiraDateTimeFormat).toDate(), dayWiseWorkLogDateFormat)))
    }, [currentDate, pendingWorkLogs]);
    
    const resumedWorkLog = pendingWorkLogsOfCurrentDate.find(r => r.resumed)
    const isResumed = !!resumedWorkLog

    const resumeTask = (rows: PendingWorkLogInt[]) => {
        let promise: Promise<any> = Promise.resolve()
        if(resumedWorkLog) {
            promise = dispatch(pausePendingWorkLog(resumedWorkLog))
        }
        promise.then(() => dispatch(resumePendingWorkLog(rows[0])))
    }

    return <Fragment>
        <EnhancedTable
            data={pendingWorkLogsOfCurrentDate}
            getRowKey={(r) => r.id}
            getRowStyle={(r) => r.resumed ? { background: lighten(theme.palette.primary.light, 0.50) } : undefined}
            selection={{
                mode: "multiple",
                by: "row",
                actions: [
                    {
                        toolTipText: () => "Upload",
                        renderIcon: () => <Publish />,
                        disabled: (rows) => rows.filter(r => !r.resumed).length !== rows.length,
                        onClick: (rows) => setSelectedWorkLogsToUpload(rows)
                    },
                    {
                        toolTipText: () => "Resume" + (isResumed ? ". The current running task will be paused.": ""),
                        renderIcon: () => <PlayArrow />,
                        disabled: (rows) => rows.length !== 1 || rows.filter(r => r.resumed).length >= 1,
                        onClick: (rows) => resumeTask(rows)
                    },
                    {
                        toolTipText: () => "Pause",
                        renderIcon: () => <Pause />,
                        disabled: (rows) => rows.length !== 1 || rows.filter(r => r.resumed).length !== rows.length,
                        onClick: (rows) => rows.forEach(r => dispatch(pausePendingWorkLog(r)))
                    },
                    {
                        toolTipText: () => "Edit",
                        renderIcon: () => <Edit />,
                        disabled: (rows) => rows.length !== 1,
                        onClick: (rows) => setCurrentSelectedWorkLog(rows[0])
                    },
                    {
                        toolTipText: () => "Delete",
                        renderIcon: () => <Delete />,
                        disabled: (rows) => rows.length === 0,
                        onClick: (rows) => rows.forEach(r => dispatch(deletePendingWorkLog(r.id)))
                    },
                ]
            }}
            columns={[
                { id: "issueKey", numeric: false, disablePadding: false, label: 'Issue', align: "left" },
                {
                    id: "started", numeric: false, disablePadding: false, label: 'Started', align: "left",
                    renderColumn: (r) => moment(r.started, JiraDateTimeFormat).format(TimeFormatForView)
                },
                {
                    id: "timeSpentSeconds", numeric: false, disablePadding: false, label: 'Time Spent', align: "left",
                    renderColumn: (r) => <JiraTimeView timeSpendInSeconds={r.timeSpentSeconds} resumed={r.resumed} />,
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
            fixedTopRowKey={resumedWorkLog?.id}
        />
        {currentSelectedWorkLog && <EditWorkLog
            workLog={currentSelectedWorkLog}
            issue={{
                id: currentSelectedWorkLog.issueId,
                key: currentSelectedWorkLog.issueKey,
                summaryText: currentSelectedWorkLog.issueSummaryText
            }} onClose={() => setCurrentSelectedWorkLog(undefined)} create={false} />}
        {selectedWorkLogsToUpload && <PublishWorkLogs
            workLogs={selectedWorkLogsToUpload}
            onClose={() => setSelectedWorkLogsToUpload(undefined)} />}

    </Fragment>
}