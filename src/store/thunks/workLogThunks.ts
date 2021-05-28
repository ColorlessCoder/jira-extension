import { createAsyncThunk } from "@reduxjs/toolkit";
import WorkLogDao from "../../services/storage/dao/workLogDao";
import { PendingWorkLogInt } from "../../types";
import sliceNames from "../slices/sliceNames";
import lodash from "lodash"
import { dayWiseWorkLogDateFormat, JiraDateTimeFormat } from "../../utils/dateUtils";
import moment from "moment";
import StaticServices from "../../services";

const workLogSliceName = sliceNames.workLogSliceName

export const addPendingWorkLog = createAsyncThunk(
    workLogSliceName + "/addPendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
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

export const pausePendingWorkLog = createAsyncThunk(
    workLogSliceName + "/pausePendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
        const updatedWorkLog = lodash.clone(pendingWorkLog)
        updatedWorkLog.timeSpentSeconds += (moment().toDate().getTime() - moment(updatedWorkLog.resumed, JiraDateTimeFormat).toDate().getTime()) / 1000
        updatedWorkLog.timeSpentSeconds = Math.ceil(updatedWorkLog.timeSpentSeconds)
        updatedWorkLog.resumed = ""
        await WorkLogDao.savePendingWorkLog(updatedWorkLog)
        return updatedWorkLog
    }
);

export const uploadPendingWorkLog = createAsyncThunk(
    workLogSliceName + "/uploadPendingWorkLog",
    async (pendingWorkLog: PendingWorkLogInt) => {
        const uploadedWorkLog = await StaticServices.JiraRestApiService.postWorkLog(pendingWorkLog)
        await WorkLogDao.removePendingWorkLog(pendingWorkLog.id)
        return {
            uploadedWorkLog,
            pendingWorkLog
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
