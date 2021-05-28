import { mainMenuActions } from './slices/mainMenuSlice';
import { settingsActions } from './slices/settingsSlice';
import { workLogActions } from './slices/workLogSlice';

export const actions = {
    mainMenu: mainMenuActions,
    workLog: workLogActions,
    settings: settingsActions
}