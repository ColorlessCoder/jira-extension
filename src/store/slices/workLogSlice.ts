import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment'
import { JiraWorkLogInt, NoteInt, PendingWorkLogInt } from '../../types';
import lodash from 'lodash';
import { dayWiseWorkLogDateFormat, JiraDateTimeFormat } from '../../utils/dateUtils';
import { addNote, addPendingWorkLog, deleteNote, deletePendingWorkLog, loadNotes, loadPendingWorkLogs, loadWorkLogsByDate, pausePendingWorkLog, resumePendingWorkLog, updateNote, updatePendingWorkLog, uploadPendingWorkLog } from '../thunks/workLogThunks';
import sliceNames from './sliceNames';
const workLogSlice = createSlice({
  name: sliceNames.workLogSliceName,
  initialState: {
    dayWiseWorkLogDate: moment().format(dayWiseWorkLogDateFormat),
    pendingWorkLog: [] as PendingWorkLogInt[],
    submittedWorkLogs: [] as JiraWorkLogInt[],
    datesForWhichWorkLogsLoaded: [] as string[],
    notes: [] as NoteInt[]
  },
  reducers: {
    incrementCurrentDate: (state) => {
      state.dayWiseWorkLogDate = moment(state.dayWiseWorkLogDate, dayWiseWorkLogDateFormat)
        .add(1, 'day')
        .format(dayWiseWorkLogDateFormat);
    },
    decrementCurrentDate: (state) => {
      state.dayWiseWorkLogDate = moment(state.dayWiseWorkLogDate, dayWiseWorkLogDateFormat)
        .subtract(1, 'day')
        .format(dayWiseWorkLogDateFormat);
    },
    setCurrentDate: (state, action: PayloadAction<{ dateValue?: Date, stringValue?: string }>) => {
      if (action.payload.dateValue) {
        state.dayWiseWorkLogDate = moment(action.payload.dateValue).format(dayWiseWorkLogDateFormat);
      } else if (action.payload.stringValue) {
        state.dayWiseWorkLogDate = action.payload.stringValue
      }
    },
    reloadSubmittedWorkLogs: (state, action: PayloadAction<Set<string>>) => {
      state.datesForWhichWorkLogsLoaded = state.datesForWhichWorkLogsLoaded.filter(r => !action.payload.has(r))
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadPendingWorkLogs.fulfilled, (state, action) => {
      state.pendingWorkLog = action.payload
    });
    builder.addCase(addPendingWorkLog.fulfilled, (state, action) => {
      state.pendingWorkLog.push(action.payload)
    });
    builder.addCase(updatePendingWorkLog.fulfilled, (state, action) => {
      let workLog = state.pendingWorkLog.find(r => r.id === action.payload.id);
      lodash.merge(workLog, action.payload);
    });
    builder.addCase(deletePendingWorkLog.fulfilled, (state, action) => {
      const index = state.pendingWorkLog.findIndex(r => r.id === action.payload)
      if (index !== -1) {
        state.pendingWorkLog.splice(index, 1);
      }
    });
    builder.addCase(resumePendingWorkLog.fulfilled, (state, action) => {
      let workLog = state.pendingWorkLog.find(r => r.id === action.payload.id);
      lodash.merge(workLog, action.payload);
    });
    builder.addCase(pausePendingWorkLog.fulfilled, (state, action) => {
      let workLog = state.pendingWorkLog.find(r => r.id === action.payload.id);
      lodash.merge(workLog, action.payload);
    });
    builder.addCase(uploadPendingWorkLog.fulfilled, (state, action) => {
      const index = state.pendingWorkLog.findIndex(r => r.id === action.payload.pendingWorkLog.id)
      if (index !== -1) {
        state.pendingWorkLog.splice(index, 1);
      }
      state.submittedWorkLogs.push(action.payload.uploadedWorkLog)
      const pendingWorkLog = action.payload.pendingWorkLog
      if (pendingWorkLog.hasNotes && pendingWorkLog.notes) {
        state.notes.push(pendingWorkLog.notes)
      }
    });
    builder.addCase(loadWorkLogsByDate.fulfilled, (state, action) => {
      console.log("Submitted WorkLog old", lodash.cloneDeep(state.submittedWorkLogs))
      state.submittedWorkLogs = [
        ...state.submittedWorkLogs.filter(r => moment(r.started, JiraDateTimeFormat).format(dayWiseWorkLogDateFormat) !== action.payload.date),
        ...action.payload.workLogs
      ];
      state.submittedWorkLogs = lodash.uniqWith(state.submittedWorkLogs, (a, b) => lodash.isEqualWith(a, b, (a, b) => a.id === b.id)); // extra safety
      const dateString = action.payload.date
      if (state.datesForWhichWorkLogsLoaded.indexOf(dateString) < 0) {
        state.datesForWhichWorkLogsLoaded.push(dateString)
      }
    });

    builder.addCase(loadNotes.fulfilled, (state, action) => {
      state.notes = action.payload
    });
    builder.addCase(addNote.fulfilled, (state, action) => {
      state.notes.push(action.payload)
    });
    builder.addCase(updateNote.fulfilled, (state, action) => {
      let notes = state.notes.find(r => r.id === action.payload.id);
      lodash.merge(notes, action.payload);
    });
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      const index = state.notes.findIndex(r => r.id === action.payload)
      if (index !== -1) {
        state.notes.splice(index, 1);
      }
    });
  }
})

export const workLogActions = workLogSlice.actions

export default workLogSlice.reducer