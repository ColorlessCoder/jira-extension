import SettingsDao, { SettingsDaoDataInt } from "./dao/settingsDao"
import WorkLogDao, { WorkLogDaoDataInt } from "./dao/workLogDao"

const workLogDao = new WorkLogDao()
const settingDao = new SettingsDao()

interface BackupDataInt {
    workLogDao: WorkLogDaoDataInt,
    settingsDao: SettingsDaoDataInt
}

export default class StorageBackupService {
    static exportDatabase = async (): Promise<BackupDataInt> => {
        return {
            workLogDao: await workLogDao.exportData(),
            settingsDao: await settingDao.exportData()
        }
    }
    static importDatabase = async (req: any) => {
        const data = req as BackupDataInt
        if(data) {
            await workLogDao.importData(data.workLogDao)
            await settingDao.importData(data.settingsDao)
        }
    }
}