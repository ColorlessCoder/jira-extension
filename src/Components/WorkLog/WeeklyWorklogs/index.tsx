import { Avatar, Card, CardContent, CardHeader, createStyles, IconButton, makeStyles, Table, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { actions } from "../../../store/actions";
import { loadWorkLogsByDate } from "../../../store/thunks/workLogThunks";
import { dayWiseWorkLogDateFormat, getAllDatesWithinRange } from "../../../utils/dateUtils";
import SummaryMenu from "./SummaryMenu";
import WorklogSummaryRow from "./WorklogSummaryRow";

const useStyles = makeStyles(theme => createStyles({
    head: {
        background: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    headCell: {
        color: theme.palette.common.white
    }
}))

export default function WeeklyWorklogs() {
    const classes = useStyles()
    const [fromDate, setFromDate] = useState<string>(moment().weekday(0).format(dayWiseWorkLogDateFormat));
    const [toDate, setToDate] = useState<string>(moment().weekday(6).format(dayWiseWorkLogDateFormat));
    const [weekly, setWeekly] = useState<boolean>(true)
    const subHeader = `From ${fromDate} to ${toDate}`
    const datesForWhichWorkLogsLoaded = useAppSelector(state => state.workLog.datesForWhichWorkLogsLoaded);
    const dispatch = useAppDispatch()

    const allDates = getAllDatesWithinRange(fromDate, toDate)

    useEffect(() => {
        allDates.forEach(date => {
            if (datesForWhichWorkLogsLoaded.indexOf(date) < 0) {
                dispatch(loadWorkLogsByDate(moment(date).toDate()));
            }
        })
    }, [dispatch, fromDate, toDate]);

    return <Card >
        <CardHeader
            action={<SummaryMenu onChangeDate={(from, to) => {setFromDate(from); setToDate(to)}} setWeekly={setWeekly} fromDate={fromDate} toDate={toDate}/>}
            title="Summary"
            subheader={subHeader}
        />
        <CardContent>
        <TableContainer>
            <Table size="small" aria-label="a dense table" style={{minWidth: 400}}>
                <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell className={classes.headCell}>Date</TableCell>
                        <TableCell className={classes.headCell} align="right">Submitted</TableCell>
                        <TableCell className={classes.headCell} align="right">Pending</TableCell>
                        <TableCell className={classes.headCell} align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <WorklogSummaryRow fromDate={fromDate} toDate={toDate} cellStyle={{fontWeight: "bold"}} rowStyle={{backgroundColor: "beige"}}/>
                {
                    allDates.map(date => <WorklogSummaryRow key={date} fromDate={date} />)
                }
            </Table>
            </TableContainer>
        </CardContent>
    </Card >
}