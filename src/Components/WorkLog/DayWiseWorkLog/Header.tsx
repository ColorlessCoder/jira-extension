import { Grid, IconButton, TextField, Tooltip } from "@material-ui/core";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { actions } from "../../../store/actions";
import { dayWiseWorkLogDateFormat } from "../../../utils/dateUtils";
import React from "react";
import { AddWorkLogButton } from "../AddWorkLogButton";
export function Header() {
    const currentDate = useAppSelector(state => state.workLog.dayWiseWorkLogDate);
    const dispatch = useAppDispatch();
    const toNextDay = () => dispatch(actions.workLog.incrementCurrentDate())
    const toPreviousDay = () => dispatch(actions.workLog.decrementCurrentDate())
    return <Grid container spacing={2} >
        <Grid item xs={6}>
            <Tooltip title="Previous Day">
                <IconButton onClick={() => toPreviousDay()}>
                    <ArrowLeft fontSize="large" />
                </IconButton>
            </Tooltip>
            <TextField
                id="dayWiseWorkLogDate"
                label="Log Date"
                type="date"
                value={currentDate ? currentDate : moment().format(dayWiseWorkLogDateFormat)}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) => dispatch(actions.workLog.setCurrentDate({ stringValue: e.target.value }))}
                onKeyDown={(e) => e.preventDefault()}
            />
            <Tooltip title="Next Day">
                <IconButton onClick={() => toNextDay()}>
                    <ArrowRight fontSize="large" />
                </IconButton>
            </Tooltip>
            <AddWorkLogButton />
        </Grid>
    </Grid>
}