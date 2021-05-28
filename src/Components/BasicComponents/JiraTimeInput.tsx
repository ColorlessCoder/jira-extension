import { Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { InfoRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { convertJiraTimeFormatToSeconds, convertTimeInSecondToJiraTimeFormat } from "../../utils/jiraUtils";

interface PropsType {
    timeInSeconds: number,
    onChange: (timeInSeconds: number) => void,
    autoFocus: boolean
}

export function JiraTimeInput(props: PropsType) {
    const { text, seconds } = convertTimeInSecondToJiraTimeFormat(props.timeInSeconds)
    const [timeString, setTimeString] = useState<string>(text);
    const [timeValue, setTimeValue] = useState<number>(props.timeInSeconds - seconds)
    const [inputSeconds, setInputSeconds] = useState<number>(seconds);
    const [invalidString, setInvalidString] = useState<boolean>(false);
    return <Grid container>
        <Grid item xs={6}>
            <TextField
                autoFocus={props.autoFocus}
                fullWidth
                label="Total Time Spent"
                value={timeString}
                error={invalidString}
                onChange={(e) => {
                    let value = e.target.value;
                    let valueInSeconds = convertJiraTimeFormatToSeconds(value)
                    const invalid = valueInSeconds === -1
                    props.onChange(valueInSeconds + (invalid ? 0: inputSeconds))
                    setTimeValue(valueInSeconds)
                    setInvalidString(invalid)
                    setTimeString(value)
                }}
                type="text"
                variant="outlined"
                inputProps={{
                    maxLength: 12,
                }}
                InputProps={{
                    endAdornment: (
                        <Tooltip title={
                            <div style={{ fontSize: 13 }}>
                                Format: <b>([0-9.]+[hm]?)+ </b>
                                <br/>Default unit is m and units are non-repeatable.
                                <br/> <b>Example:</b> 1.5h 20m
                            </div>}
                            style={{ cursor: "pointer" }}>
                            <InfoRounded />
                        </Tooltip>
                    ),
                }}
            />
        </Grid>
        <Grid item xs={2}>
            <Typography align="center" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                and
            </Typography>
        </Grid>
        <Grid item xs={4}>
            <TextField
                fullWidth
                label="Seconds"
                type="number"
                variant="outlined"
                disabled={invalidString}
                onChange={(e) => {
                    let stringValue = e.target.value;
                    let numberValue = 0;
                    if(stringValue) {
                        numberValue = Number.parseInt(stringValue)
                        if(numberValue<0) {
                            numberValue = 0
                        } else if (numberValue >= 60){
                            numberValue = 59
                        }
                    }
                    setInputSeconds(numberValue);
                    props.onChange(timeValue + numberValue)
                }}
                value={inputSeconds}
            />
        </Grid>
    </Grid>
}