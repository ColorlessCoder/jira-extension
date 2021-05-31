import { createAsyncThunk } from "@reduxjs/toolkit";
import sliceNames from "../slices/sliceNames";
import SettingsDao from "../../services/storage/dao/settingsDao";
import StaticServices from "../../services";

const settingsSliceName = sliceNames.settingsSliceName

export const loadSettings = createAsyncThunk(
    settingsSliceName + "/loadSettings",
    async () => {
        let settings = await SettingsDao.getSettings()
        StaticServices.JiraRestApiService.setJiraDomainUrl(settings.jiraDomainUrl)
        await StaticServices.JiraRestApiService.fetchCurrentUser(true)
        return settings
    }
);

export const saveJiraDomainUrl = createAsyncThunk(
    settingsSliceName + "/saveJiraDomainUrl",
    async (url: string) => {
        let settings = await SettingsDao.getSettings()
        settings.jiraDomainUrl = url
        await SettingsDao.saveSettings(settings)
        return url
    }
);

export const getAllUsersOfProject = createAsyncThunk(
    settingsSliceName + "/getAllUsersOfProject",
    async (projectKey: string) => {
        return await StaticServices.JiraRestApiService.getAllUsersOfProject(projectKey)
    }
);