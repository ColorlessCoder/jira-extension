import React from "react";
import StaticServices from "../../services";
import { JiraUserPickerInt} from "../../types";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Avatar, CircularProgress, ListItem, ListItemAvatar, ListItemText, TextField } from "@material-ui/core";

interface JiraUserSearchProps{
    initialValue?: JiraUserPickerInt|null,
    onChange: (value: JiraUserPickerInt|undefined) => any,
    fullWidth?: boolean,
    autoFocus?: boolean,
    query?: string,
    label: string
}

export function JiraUserSearch(props: JiraUserSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<JiraUserPickerInt[]>([]);
    const [queryString, setQueryString] = React.useState<string>(props.initialValue ? props.initialValue.displayName: (props.query? props.query: ""));
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        if(open) {
            let active = true;
            
            if (!loading) {
                return undefined;
            }
            if(queryString) {
                StaticServices.JiraRestApiService.getAllUsersForPicker(queryString)
                    .then(res => active && (setOptions(res), setLoading(false)))
                    .catch(StaticServices.CommonLogService.logError)
            } else {
                setOptions([]);
                setLoading(false);
            }
            return () => {
                active = false;
            };
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        } else if(options.length === 0){
            setLoading(true);
        }
        // eslint-disable-next-line
    }, [open]);

    React.useEffect(() => {
        if (open) {
            setLoading(true);
        }
        // eslint-disable-next-line
    }, [queryString]);

    const onSelectIssue = (option: JiraUserPickerInt| null) => {
        setQueryString(option? option.displayName: "")
        props.onChange(option ? option: undefined)
    }
    return (
        <Autocomplete
            fullWidth={props.fullWidth ? true: false}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.accountId === value.accountId}
            getOptionLabel={(option) => option.displayName}
            renderOption = {(option) => <ListItem>
                <ListItemAvatar><Avatar src={option.avatarUrl}/></ListItemAvatar>
                <ListItemText>{option.displayName}</ListItemText>
            </ListItem>}
            options={options}
            loading={loading}
            defaultValue={props.initialValue}
            onChange={(e, value) => onSelectIssue(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    autoFocus={props.autoFocus}
                    label={props.label}
                    variant="outlined"
                    value={queryString ? queryString: ""}
                    onChange={e => setQueryString(e.target.value)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}