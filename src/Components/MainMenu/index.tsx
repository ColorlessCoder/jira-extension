import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from "./Header"
import MenuDrawer from './MenuDrawer';
import MainMenuContent from './MainMenuContent';
import { Backdrop } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { loadSettings } from '../../store/thunks/settingsThunks';
import { loadPendingWorkLogs } from '../../store/thunks/workLogThunks';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(1)}px)`,
      marginTop: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(1)}px)`,
      position: "relative"
    },
  }),
);

export default function MainMenu() {
  const classes = useStyles();
  const dispatch = useAppDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState<boolean>(true)
  const jiraDomainUrl = useAppSelector(state => state.settings.jiraDomainUrl)

  useEffect(() => {
    dispatch(loadSettings())
      .then(() => setLoading(false))
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (jiraDomainUrl) {
        dispatch(loadPendingWorkLogs())
          .then(() => history.push("/work-log"))
      } else {
        history.push({ pathname: "/settings", state: {errorConnect: true}})
      }
    }
  }, [jiraDomainUrl, loading])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <MenuDrawer />
      {!loading && <main className={classes.content}>
        <MainMenuContent />
      </main>}
      <Backdrop open={loading}/>
    </div>
  );
}
