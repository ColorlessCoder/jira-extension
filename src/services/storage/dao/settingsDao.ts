import { PendingWorkLogInt, SettingsInt } from "../../../types";
import storage from "../index";

const SETTINGS = "SETTINGS";

export default class SettingsDao {
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