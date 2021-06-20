import { Button, Grid } from "@material-ui/core";
import React, { useRef } from "react";
import StorageBackupService from "../../services/storage/backupService";

export default function Backup() {
    const fileRef = useRef<HTMLInputElement>(null)
    const importClicked = () => {
        fileRef.current?.click()
    }
    const importFile = (files: FileList|null) => {
        if(files && files.length > 0) {
            const reader = new FileReader()
            reader.onload = function () {
                if(typeof reader.result == 'string') {
                    StorageBackupService.importDatabase(JSON.parse(reader.result))
                        .then(() => document.location.reload())
                }
            }
            reader.readAsText(files[0])
        }
    }

    const exportFile = () => {
        StorageBackupService.exportDatabase()
            .then(data => downloadPrompt(data))
    }

    const downloadPrompt = (data: any) => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(data)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = "dev-assistant-backup.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    return <Grid container style={{textAlign: "center", padding: 50}}>
        <Grid item xs={12}>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => importClicked()}
            >
                Import
            </Button>
            <Button
                style={{marginLeft: 10}}
                variant="contained"
                color="primary"
                onClick={() => exportFile()}
            >
                Export
            </Button>
            <input type="file" accept="application/json" ref={fileRef} style={{display: 'none'}} onChange={(e) => importFile(e.target.files)}/>
        </Grid>
    </Grid>
}