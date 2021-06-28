import { createAsyncThunk } from "@reduxjs/toolkit";
import WorkLogDao from "../../services/storage/dao/workLogDao";
import { NoteInt, PendingWorkLogInt } from "../../types";
import sliceNames from "../slices/sliceNames";
import lodash from "lodash"
import { dayWiseWorkLogDateFormat, JiraDateTimeFormat } from "../../utils/dateUtils";
import moment from "moment";
import StaticServices from "../../services";
import { RootState } from "..";

const workLogSliceName = sliceNames.workLogSliceName

export const addPendingWorkLog = createAsyncThunk(
    workLogSliceName + "/addPendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
        if(pendingWorkLog.resumed) {
            
        }
        await WorkLogDao.savePendingWorkLog(pendingWorkLog)
        return pendingWorkLog
    }
);

export const updatePendingWorkLog = createAsyncThunk(
    workLogSliceName + "/updatePendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
        await WorkLogDao.savePendingWorkLog(pendingWorkLog)
        return pendingWorkLog
    }
);

export const deletePendingWorkLog = createAsyncThunk(
    workLogSliceName + "/deletePendingWorkLog",
    async (id: string) => {
        await WorkLogDao.removePendingWorkLog(id)
        return id
    }
);

export const loadPendingWorkLogs = createAsyncThunk(
    workLogSliceName + "/loadAllPendingWorkLog",
    async () => {
        let response = await WorkLogDao.getAllPendingWorkLogs()
        return response
    }
);

export const resumePendingWorkLog = createAsyncThunk(
    workLogSliceName + "/resumePendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
        const updatedWorkLog = lodash.clone(pendingWorkLog)
        updatedWorkLog.resumed = moment().format(JiraDateTimeFormat)
        await WorkLogDao.savePendingWorkLog(updatedWorkLog)
        return updatedWorkLog
    }
);

async function pauseWorkLog(pendingWorkLog: PendingWorkLogInt| null, state: RootState) {
    let updatedWorkLog: PendingWorkLogInt|null|undefined = pendingWorkLog
    // const state = getState() as RootState
    if(pendingWorkLog == null) {
        updatedWorkLog = state.workLog.pendingWorkLog.find(r => r.resumed)
    }
    updatedWorkLog = lodash.cloneDeep(updatedWorkLog)
    if(updatedWorkLog) {
        updatedWorkLog.timeSpentSeconds += (moment().toDate().getTime() - moment(updatedWorkLog.resumed, JiraDateTimeFormat).toDate().getTime()) / 1000
        updatedWorkLog.timeSpentSeconds = Math.ceil(updatedWorkLog.timeSpentSeconds)
        updatedWorkLog.resumed = ""
        await WorkLogDao.savePendingWorkLog(updatedWorkLog)
        console.log("updatedWork:" , updatedWorkLog)
    }
    return updatedWorkLog
}

export const pausePendingWorkLog = createAsyncThunk(
    workLogSliceName + "/pausePendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt|null, {getState}) => {
        const updatedWorkLog = await pauseWorkLog(pendingWorkLog, getState() as RootState)
        return updatedWorkLog
    }
);

export const uploadPendingWorkLog = createAsyncThunk(
    workLogSliceName + "/uploadPendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
        try {
            console.log("Uploading")
            const uploadedWorkLog = await StaticServices.JiraRestApiService.postWorkLog(pendingWorkLog)
            await WorkLogDao.removePendingWorkLog(pendingWorkLog.id)
            let notes = undefined
            if (pendingWorkLog.hasNotes && pendingWorkLog.notes) {
                notes = {
                    ...pendingWorkLog.notes,
                    issueKey: pendingWorkLog.issueKey, issueSummaryText: pendingWorkLog.issueSummaryText,
                    spentTime: pendingWorkLog.timeSpentSeconds,
                    createAt: moment(pendingWorkLog.started, JiraDateTimeFormat).toDate().getTime()
                }
                await WorkLogDao.saveNote(notes)
            }
            return {
                uploadedWorkLog,
                pendingWorkLog: {...pendingWorkLog, notes}
            }
        } catch (e) {
            console.log(e)
            throw e
        }
    }
);

export const loadWorkLogsByDate = createAsyncThunk(
    workLogSliceName + "/loadWorkLogsByDate",
    async (date: Date) => {
        return {
            workLogs: await StaticServices.JiraRestApiService.getWorkLogsByDate(date),
            date: moment(date).format(dayWiseWorkLogDateFormat)
        }
    }
);

export const addNote = createAsyncThunk(
    workLogSliceName + "/addNote",
    async (Note: NoteInt) => {
        await WorkLogDao.saveNote(Note)
        return Note
    }
);

export const updateNote = createAsyncThunk(
    workLogSliceName + "/updateNote",
    async (Note: NoteInt) => {
        await WorkLogDao.saveNote(Note)
        return Note
    }
);

export const deleteNote = createAsyncThunk(
    workLogSliceName + "/deleteNote",
    async (id: string) => {
        await WorkLogDao.removeNote(id)
        return id
    }
);

export const loadNotes = createAsyncThunk(
    workLogSliceName + "/loadAllNote",
    async () => {
        let response = await WorkLogDao.getAllNotes()
        return response
    }
);
