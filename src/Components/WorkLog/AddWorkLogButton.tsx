import { IconButton, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import React, { Fragment, useState } from "react";
import { EditWorkLog } from "./EditWorkLog";

export function AddWorkLogButton() {
    const [editWorkLogVisible, setEditWorkLogVisible] = useState(false)
    return <Fragment>
        <Tooltip title="Add new Work Log">
            <IconButton onClick={() => setEditWorkLogVisible(true)}>
                <AddIcon fontSize="large"/>
            </IconButton>
        </Tooltip>
        {editWorkLogVisible && <EditWorkLog onClose={() => setEditWorkLogVisible(false)} create/>}
    </Fragment>
}