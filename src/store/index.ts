import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import mainMenuSlice from "./slices/mainMenuSlice";
import settingsSlice from './slices/settingsSlice';
import workLogSlice from './slices/workLogSlice';

const store = configureStore({
  reducer: {
    mainMenu: mainMenuSlice,
    workLog: workLogSlice,
    settings: settingsSlice
  },
  middleware: getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;