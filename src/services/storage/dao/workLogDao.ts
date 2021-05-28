import { PendingWorkLogInt } from "../../../types";
import storage from "../index";

const PENDING_WORK_LOG = "PENDING_WORK_LOG";

export default class WorkLogDao {
    static getAllPendingWorkLogs = async () => {
        let pendingWorkLogs: PendingWorkLogInt[] = []
        const logIds = await storage.get<string[]>(PENDING_WORK_LOG);
        if (logIds) {
            for (let logId of logIds) {
                let workLog = await storage.get<PendingWorkLogInt>(logId)
                if (workLog) {
                    pendingWorkLogs.push(workLog)
                }
            }
        }
        return pendingWorkLogs;
    }

    static savePendingWorkLog = async (workLog: PendingWorkLogInt) => {
        let existingWorkLog = await storage.get<PendingWorkLogInt>(workLog.id)
        if (!existingWorkLog) {
            let logIds = await storage.get<string[]>(PENDING_WORK_LOG);
            if (!logIds) {
                logIds = []
            }
            logIds.push(workLog.id)
            await storage.set(PENDING_WORK_LOG, logIds)
        }
        await storage.set(workLog.id, workLog)
    }

    static removePendingWorkLog = async (id: string) => {
        let logIds = await storage.get<string[]>(PENDING_WORK_LOG);
        if (logIds) {
            await storage.set(PENDING_WORK_LOG, logIds.filter(r => r != id))
        }
        await storage.remove(id)
    }
}