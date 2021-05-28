import moment from "moment";
import { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { loadWorkLogsByDate } from "../../../store/thunks/workLogThunks";
import { areSameDate, dayWiseWorkLogDateFormat, JiraDateTimeFormat, TimeFormatForView } from "../../../utils/dateUtils";
import { convertJiraCommentToText } from "../../../utils/jiraUtils";
import EnhancedTable from "../../BasicComponents/EnhancedTable";
import JiraTimeView from "../../BasicComponents/JiraTimeView";

export function SubmittedWorkLog() {
    const currentDate = useAppSelector(state => state.workLog.dayWiseWorkLogDate);
    const dispatch = useAppDispatch();
    const datesForWhichWorkLogsLoaded = useAppSelector(state => state.workLog.datesForWhichWorkLogsLoaded);
    const workLogs = useAppSelector(state => state.workLog.submittedWorkLogs);
    // const [currentSelectedWorkLog, setCurrentSelectedWorkLog] = useState<JiraWorkLogInt>()
    useEffect(() => {
        if(datesForWhichWorkLogsLoaded.indexOf(currentDate) < 0) {
            dispatch(loadWorkLogsByDate(moment(currentDate).toDate()));
        }
    }, [datesForWhichWorkLogsLoaded, dispatch, currentDate]);
    return <Fragment>
        <EnhancedTable
            data={workLogs.filter(r => areSameDate(moment(currentDate, dayWiseWorkLogDateFormat).toDate(), moment(r.started, JiraDateTimeFormat).toDate(), dayWiseWorkLogDateFormat))}
            getRowKey={(r) => r.id}
            selection={{
                mode: "none",
                by: "row",
                actions: [
                    // {
                    //     toolTipText: () => "Edit",
                    //     renderIcon: () => <Edit />,
                    //     disabled: (rows) => rows.length !== 1,
                    //     onClick: (rows) => setCurrentSelectedWorkLog(rows[0])
                    // },
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
                    renderColumn: (r) => <JiraTimeView timeSpendInSeconds={r.timeSpentSeconds} />,
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
    </Fragment>
}