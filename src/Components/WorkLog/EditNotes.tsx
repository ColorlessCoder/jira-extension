import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { useState } from "react";
import { JiraUserPickerInt, NoteInt, NoteTypeInt } from "../../types";
import { JiraUserSearch } from "../BasicComponents/JiraUserSearch";

interface EditNotesProps {
    note: NoteInt,
    onChange?: () => any,
    onSave?: (note: NoteInt) => any,
    initialOnEditMode?: boolean
}
export default function EditNotes(props: EditNotesProps) {
    const {note, onSave, onChange} = props
    const [type, setType] = useState<NoteTypeInt>(note.type)
    const [rating, setRating] = useState<number|null>(note.rating)
    const [forUser, setForUser] = useState<JiraUserPickerInt|undefined>(note.forUser)
    const [details, setDetails] = useState<string>(note.details)
    const [editMode, setEditMode] = useState<boolean>(!!props.initialOnEditMode)
    const valueChanged = () => {
        setEditMode(true)
        if(onChange) {
            onChange()
        }
    }
    return <Grid container>
        <Grid xs={12} style={{marginTop: 10}}>
            <FormControl required fullWidth>
                <InputLabel id="note-type">Type</InputLabel>
                <Select labelId="note-type" value={type} onChange={(e) => (setType(e.target.value as NoteTypeInt), valueChanged())} fullWidth>
                    <MenuItem value="Discussion">Discussion</MenuItem>
                    <MenuItem value="Code Review">Code Review</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid xs={12} style={{marginTop: 10}}>
            <JiraUserSearch initialValue={forUser} onChange={(r) => (setForUser(r), valueChanged())} fullWidth={true} label="For user"/>
        </Grid>
        <Grid xs={12} style={{marginTop: 10}}>
            <Rating
                name="note-rating"
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue);
                    valueChanged();
                }}
            />
        </Grid>
        <Grid xs={12} style={{marginTop: 10}}>
            <TextField label="Details" value={details} multiline fullWidth onChange={e => (setDetails(e.target.value), valueChanged())}/>
        </Grid>
        {onSave && <Grid xs={12} style={{marginTop: 10}}>
            <Button variant="contained" color="primary" disabled={!editMode} onClick={() => (onSave({...note, type, rating, forUser, details}), setEditMode(false))}>Save Note</Button>
        </Grid>}
    </Grid>
}