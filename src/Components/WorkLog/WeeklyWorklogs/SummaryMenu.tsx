import { IconButton, MenuItem, ListItemIcon, Typography } from "@material-ui/core";
import { MoreVert, Refresh } from "@material-ui/icons";
import { Fragment, useState } from "react";
import Menu from '@material-ui/core/Menu';
import moment, { Moment } from "moment";
import { dayWiseWorkLogDateFormat, getAllDatesWithinRange } from "../../../utils/dateUtils";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { actions } from "../../../store/actions";

interface SummaryMenuProps {
    onChangeDate: (from: string, to: string) => any,
    setWeekly?: (isWeekly: boolean) => any,
    fromDate: string,
    toDate: string,
}
export default function SummaryMenu(props: SummaryMenuProps) {
    const { fromDate, toDate, onChangeDate } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const currentLogDate = useAppSelector(state => state.workLog.dayWiseWorkLogDate);
    const dispatch = useAppDispatch()

    const open = Boolean(anchorEl);
    const allDates = getAllDatesWithinRange(fromDate, toDate)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const reloadWorkLogs = () => {
        dispatch(actions.workLog.reloadSubmittedWorkLogs(new Set(allDates)))
    }

    const updateWeekRange = (dateOfTheWeek: Moment) => {
        const fd = dateOfTheWeek.format(dayWiseWorkLogDateFormat)
        const td = dateOfTheWeek.weekday(6).format(dayWiseWorkLogDateFormat)
        onChangeDate(fd, td)
        setAnchorEl(null)
    }

    const nextWeek = () => {
        const date = moment(toDate).add(1, 'day').weekday(0)
        updateWeekRange(date)
    }

    const previousWeek = () => {
        const date = moment(fromDate).subtract(1, 'day').weekday(0)
        updateWeekRange(date)
    }

    const currentWeek = () => {
        const date = moment().weekday(0)
        updateWeekRange(date)
    }

    const currentLogWeek = () => {
        const date = moment(currentLogDate).weekday(0)
        updateWeekRange(date)
    }

    return <Fragment>
        <IconButton aria-label="refresh" onClick={handleClick} >
            <MoreVert />
        </IconButton>
        <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={() => setAnchorEl(null)}
        >
            <MenuItem onClick={previousWeek} >
                <Typography variant="inherit">Previous Week</Typography>
            </MenuItem>
            <MenuItem onClick={nextWeek} >
                <Typography variant="inherit">Next Week</Typography>
            </MenuItem>
            <MenuItem onClick={currentWeek}>
                <Typography variant="inherit">Current Week</Typography>
            </MenuItem>
            <MenuItem onClick={currentLogWeek}>
                <Typography variant="inherit">Current Logging Week</Typography>
            </MenuItem>
            <MenuItem onClick={reloadWorkLogs}>
                <ListItemIcon>
                    <Refresh fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Reload</Typography>
            </MenuItem>
        </Menu>
    </Fragment>
}
