import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Select, MenuItem, IconButton } from "@material-ui/core";
import moment from "moment";
import React, { useState } from "react";
import { JiraDateTimeFormat, TimeFormatForView } from "../../utils/dateUtils";
import { convertTimeInSecondToJiraTimeFormat, convertJiraCommentToText } from "../../utils/jiraUtils";
import EnhancedTable, { BasicColumnType } from "./EnhancedTable";
import JiraTimeView from "./JiraTimeView";
import lodash from 'lodash'
import { Delete } from "@material-ui/icons";

export type OperatorType = "=" | "<" | ">" | "in" | "contains"
export type FilterValueType = string | number | (string | number)[]

interface FilterDataProps<T> {
    data: T[],
    headerTitle?: string
    columns: BasicColumnType<T, keyof T & string>[],
    filters: FilterType<T>[],
    onChange: (filters: FilterType<T>[]) => void,
    onClose: () => any
}

export interface FilterType<T> {
    key: keyof T & string,
    operator: OperatorType,
    value: FilterValueType
}

function defaultComparator(operator: OperatorType, a: any, b: FilterValueType) {
    if (typeof b == "string") b = b.toLowerCase()
    if (typeof a == "string") a = a.toLowerCase()

    if (operator == "=") {
        return a == b
    } else if (operator == "<") {
        return a < b
    }
    if (operator == ">") {
        return a > b
    }
    if (operator == "in" && b instanceof Array) {
        return b.includes(a)
    }
    if (operator == "contains" && typeof b == "string") {
        return String(a).toLowerCase().includes(b)
    }
    return true
}

export function filter<T>(data: T[], columns: BasicColumnType<T, keyof T & string>[], filters: FilterType<T>[]) {
    return data.filter(row => {
        return !filters.find(f => {
            let column = columns.find(c => c.id === f.key)
            if (column) {
                let compareResult = null
                if (column.comparator && typeof f.value == 'string') {
                    compareResult = column.comparator(f.operator, row[f.key], f.value, defaultComparator)
                }
                if (compareResult === null) {
                    compareResult = defaultComparator(f.operator, row[f.key], f.value)
                }
                return !compareResult
            }
            return false
        })
    })
}

export default function FilterData<T>(props: FilterDataProps<T>) {
    const [filters, setFilters] = useState<FilterType<T>[]>(lodash.cloneDeep(props.filters))
    const addFilterAtFirst = () => {
        const filter: FilterType<T> = {
            key: props.columns[0].id,
            operator: "=",
            value: props.columns[0].numeric ? 0 : ""
        }
        setFilters([filter, ...filters])
    }
    return <Dialog open={true} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
        <DialogTitle id="form-dialog-title">Filter: {props.headerTitle}</DialogTitle>
        <DialogContent>
            <Grid container>
                <Grid item xs={12} style={{ textAlign: "center"}}>
                    <Button color="primary" variant="contained" onClick={() => addFilterAtFirst()}>Create filter</Button>
                </Grid>
                {
                    filters.map((f, i) => <Grid item xs={12} key={i + 1}>
                        <FilterRow data={props.data} columns={props.columns} filter={f} onChange={(nf) => setFilters(filters.map((_, j) => i == j ? nf : _))}
                            onDelete={(a) => setFilters(filters.filter(b => a!=b))} />
                    </Grid>)
                }
            </Grid>
        </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onChange(filters)} color="primary" variant="contained">OK</Button>
                <Button onClick={() => props.onClose()} color="secondary">Cancel</Button>
            </DialogActions>
    </Dialog>
}

function FilterRow<T>(props: {
            data: T[],
    columns: BasicColumnType<T, keyof T & string>[],
    filter: FilterType<T>,
    onChange: (f: FilterType<T>) => any,
    onDelete: (f: FilterType<T>) => any
}) {
    const allOperators: OperatorType[] = ["=", "<", ">", "contains", "in"]
    return <Grid container spacing={4} style={{marginTop: 5, marginBottom: 5}}>
                            <Grid item xs={4}>
                                <Select
                                    fullWidth
                                    variant="outlined" label="Column" value={props.filter.key} onChange={event => props.onChange({ ...props.filter, key: event.target.value as keyof T & string })}>
                                    {props.columns.map(c => <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>)}
                                </Select>
                            </Grid>
                            <Grid item xs={2}>
                                <Select
                                    fullWidth
                                    variant="outlined" label="Operation" value={props.filter.operator} onChange={event => props.onChange({ ...props.filter, operator: event.target.value as OperatorType })}>
                                    {allOperators.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="Value"
                                    variant="outlined"
                                    value={props.filter.value}
                                    onChange={event => props.onChange({ ...props.filter, value: event.target.value as FilterValueType })}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton color="secondary" onClick={() => props.onDelete(props.filter)}><Delete /></IconButton>
                            </Grid>
                        </Grid>
}