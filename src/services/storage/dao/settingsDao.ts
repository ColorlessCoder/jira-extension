import { PendingWorkLogInt, SettingsInt } from "../../../types";
import BaseDao from './baseDao'
import storage from "../index";

const SETTINGS = "SETTINGS";

export interface SettingsDaoDataInt {
    settings: SettingsInt
}

export default class SettingsDao implements BaseDao<SettingsDaoDataInt>{
    exportData = async (): Promise<SettingsDaoDataInt>  => {
        return {
            settings: await SettingsDao.getSettings()
        }
    }

    importData = async (data: SettingsDaoDataInt) => {
        SettingsDao.saveSettings(data.settings)
    }

    static getSettings = async (): Promise<SettingsInt> => {
        const response = await storage.get<SettingsInt>(SETTINGS);
        return response ? response: {
            jiraDomainUrl: ""
        }
    }

    static saveSettings = async (settings: SettingsInt) => {
        await storage.set(SETTINGS, settings)
    }
}