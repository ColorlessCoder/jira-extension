import { NoteInt, PendingWorkLogInt } from "../../../types";
import storage from "../index";

const PENDING_WORK_LOG = "PENDING_WORK_LOG";
const NOTES = "NOTES";

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

    static getAllNotes = async () => {
        let notes: NoteInt[] = []
        const noteIds = await storage.get<string[]>(NOTES);
        if (noteIds) {
            for (let logId of noteIds) {
                let workLog = await storage.get<NoteInt>(logId)
                if (workLog) {
                    notes.push(workLog)
                }
            }
        }
        return notes;
    }

    static saveNote = async (note: NoteInt) => {
        let existingNote = await storage.get<NoteInt>(note.id)
        if (!existingNote) {
            let noteIds = await storage.get<string[]>(NOTES);
            if (!noteIds) {
                noteIds = []
            }
            noteIds.push(note.id)
            await storage.set(NOTES, noteIds)
        }
        await storage.set(note.id, note)
    }

    static removeNote = async (id: string) => {
        let noteIds = await storage.get<string[]>(NOTES);
        if (noteIds) {
            await storage.set(NOTES, noteIds.filter(r => r != id))
        }
        await storage.remove(id)
    }
}