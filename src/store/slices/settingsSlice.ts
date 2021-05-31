import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JiraUserInt } from '../../types';
import { getAllUsersOfProject, loadSettings, saveJiraDomainUrl } from '../thunks/settingsThunks';
import sliceNames from './sliceNames'
const settingsSlice = createSlice({
  name: sliceNames.settingsSliceName,
  initialState: {
    jiraDomainUrl: "",
    jiraUsers: [] as JiraUserInt[]
  },
  reducers: {
    setDomainUrl: (state, action: PayloadAction<string>) => {
      if(state.jiraDomainUrl !== action.payload) {
        state.jiraDomainUrl = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadSettings.fulfilled, (state, action) => {
      state.jiraDomainUrl = action.payload.jiraDomainUrl
    });
    builder.addCase(saveJiraDomainUrl.fulfilled, (state, action) => {
      state.jiraDomainUrl = action.payload
    });
    builder.addCase(getAllUsersOfProject.fulfilled, (state, action) => {
      state.jiraUsers = action.payload
    });
  }
})

export const settingsActions = settingsSlice.actions

export default settingsSlice.reducer