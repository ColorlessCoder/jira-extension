import { TableRow, TableCell, makeStyles, createStyles, lighten, darken } from "@material-ui/core";
import moment from "moment";
import { useAppSelector } from "../../../hooks/storeHooks";
import { JiraDateTimeFormat } from "../../../utils/dateUtils";
import { roundTimeInSeconds } from "../../../utils/jiraUtils";
import JiraTimeView from "../../BasicComponents/JiraTimeView";

const useStyle = makeStyles((theme) => createStyles({
    activeDate: {
        color: theme.palette.text.primary,
        backgroundColor: lighten(theme.palette.primary.light, 0.5),
    },
    date: {
        color: theme.palette.primary.dark
    },

}))

interface WorklogSummaryRowProps {
    fromDate: string,
    toDate?: string,
    cellStyle?: any,
    rowStyle?: any
}

export default function WorklogSummaryRow(props: WorklogSummaryRowProps) {
    const date = props.fromDate
    const classes = useStyle()
    const pendingWorkLogs = useAppSelector(state => state.workLog.pendingWorkLog);
    const workLogs = useAppSelector(state => state.workLog.submittedWorkLogs);
    const currentActiveDate = useAppSelector(state => state.workLog.dayWiseWorkLogDate);

    const isDateWithinRange = (started: string) => {
        const toDate = props.toDate ? props.toDate: date
        return moment(started, JiraDateTimeFormat).isBetween(date, toDate, "day", "[]")
    }

    const totalSubmitted = workLogs
        .filter(r => isDateWithinRange(r.started))
        .map(r => r.timeSpentSeconds).reduce((r, a) => r + a, 0)

    const totalPending = pendingWorkLogs.filter(r => isDateWithinRange(r.started))
        .map(r => roundTimeInSeconds(r.timeSpentSeconds))
        .reduce((r, a) => r + a, 0);

    const resumed = pendingWorkLogs.filter(r => isDateWithinRange(r.started)).find(r => !!r.resumed)?.resumed
    const total = totalSubmitted + totalPending
    return  <TableRow className={!props.toDate && currentActiveDate === date ? classes.activeDate: ""} style={props.rowStyle}>
    <TableCell style={props.cellStyle} className={classes.date} component="th" scope="row">{props.toDate ? "Total" :moment(date).format("dddd")}</TableCell>
    <TableCell style={props.cellStyle} align="right"><JiraTimeView timeSpendInSeconds={totalSubmitted}/></TableCell>
    <TableCell style={props.cellStyle} align="right"><JiraTimeView timeSpendInSeconds={totalPending} resumed={resumed} roundSeconds/></TableCell>
    <TableCell style={props.cellStyle} align="right"><JiraTimeView timeSpendInSeconds={total} resumed={resumed} roundSeconds/></TableCell>
  </TableRow>
}