import React from "react";
import StaticServices from "../../services";
import { JiraIssueBasicInt, JiraIssuePickerResponseInt } from "../../types";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress, TextField } from "@material-ui/core";

function processJiraSuggestion(response: JiraIssuePickerResponseInt): JiraIssueBasicInt[] {
    let result: JiraIssueBasicInt[] = [];
    let set = new Set<string>()
    response.sections.forEach(section => {
        section.issues.forEach(issue => {
            if(!set.has(issue.key)) {
                set.add(issue.key);
                result.push(issue);
            }
        })
    });
    set.clear();
    return result;
}

interface JiraIssueSearchProps{
    initialValue?: JiraIssueBasicInt|null,
    onChange: (value: JiraIssueBasicInt|null) => any,
    fullWidth?: boolean,
    autoFocus?: boolean
}

function getLabelForOption(option: JiraIssueBasicInt) {
    return option.key+ " " + option.summaryText
}

export function JiraIssueSearch(props: JiraIssueSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<JiraIssueBasicInt[]>([]);
    const [queryString, setQueryString] = React.useState<string>(props.initialValue ? getLabelForOption(props.initialValue): "");
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        if(open) {
            let active = true;
            
            if (!loading) {
                return undefined;
            }
            
            StaticServices.JiraRestApiService.getIssueSuggestion(queryString)
            .then(res => active && (setOptions(processJiraSuggestion(res)), setLoading(false)))
            .catch(StaticServices.CommonLogService.logError)
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

    const onSelectIssue = (option: JiraIssueBasicInt| null) => {
        setQueryString(option? getLabelForOption(option): "")
        props.onChange(option)
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
            getOptionSelected={(option, value) => option.key === value.key}
            getOptionLabel={(option) => getLabelForOption(option)}
            options={options}
            loading={loading}
            defaultValue={props.initialValue}
            onChange={(e, value) => onSelectIssue(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    autoFocus={props.autoFocus}
                    label="Jira Issue"
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