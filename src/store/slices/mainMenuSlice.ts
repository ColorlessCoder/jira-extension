import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import sliceNames from './sliceNames'
const mainMenuSlice = createSlice({
  name: sliceNames.mainMenuSliceName,
  initialState: {
    open: false,
    headerTitle: "Dev Assistant"
  },
  reducers: {
    openDrawer: (state) => {
      state.open = true
    },
    closeDrawer: (state) => {
      state.open = false
    },
    toggleDrawer: (state) => {
      state.open = !state.open
    },
    setHeaderTitle: (state, action: PayloadAction<string>) => {
        state.headerTitle = action.payload
    }
  },
})

export const mainMenuActions = mainMenuSlice.actions

export default mainMenuSlice.reducer