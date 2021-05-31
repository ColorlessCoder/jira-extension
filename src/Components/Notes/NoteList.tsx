import React, { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { workLogActions } from "../../store/slices/workLogSlice";
import { loadNotes } from "../../store/thunks/workLogThunks";
import EnhancedTable from "../BasicComponents/EnhancedTable";
import lodash from 'lodash'
import { Avatar, Grid } from "@material-ui/core";
import moment from "moment";
import JiraTimeView from "../BasicComponents/JiraTimeView";
import { JiraUserPickerInt } from "../../types";

export default function NoteList() {
    const notes = useAppSelector(s => s.workLog.notes)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!notes.length) {
            dispatch(loadNotes())
        }
    }, [])
    return <EnhancedTable
        headerTitle="Notes"
        data={notes}
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
            { id: "createAt", numeric: false, disablePadding: false, align: "left", label: "Created", renderColumn: (row) => moment(row.createAt).format("DD/MM/YYYY HH:mm")}, 
            { id: "issueKey", numeric: false, disablePadding: false, align: "left", label: "Issue" }, 
            {
                id: "forUser", numeric: false, disablePadding: false, label: 'Person', align: "left",
                comparator: (op, a, b, def) => {
                    return def(op, (a as JiraUserPickerInt)?.displayName, b)
                },
                descendingComparator: (a: any, b: any) => {
                    const nameA = lodash.get(a, 'displayName', "")
                    const nameB = lodash.get(b, 'displayName', "")
                    return nameA > nameB ? -1 : (nameA === nameB ? 0 : 1)
                },
                renderColumn: row => <Grid container>
                    <Grid xs={2}><Avatar style={{height: 20, width: 20}} src={row.forUser?.avatarUrl} /></Grid>
                    <Grid xs={10}>{row.forUser?.displayName}</Grid>
                </Grid>
            },
            { id: "type", numeric: false, disablePadding: false, label: 'Type', align: "left" },
            { id: "rating", numeric: true, disablePadding: false, label: 'Rating', align: "left" },
            { id: "spentTime", numeric: true, disablePadding: false, label: 'Spent', align: "left", renderColumn: (row) => row.spentTime && <JiraTimeView timeSpendInSeconds={row.spentTime} />},
            {
                id: "details", numeric: false, disablePadding: false, label: 'Details', align: "left", disableSorting: true
            },
        ]}
        sorting={{
            defaultSortingOrder: "asc"
        }}
    />
}