import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { actions } from '../../store/actions';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    }),
);

export default function Header() {
    const classes = useStyles();
    const headerTitle = useAppSelector(state => state.mainMenu.headerTitle)
    const menuOpen = useAppSelector(state => state.mainMenu.open)
    const dispatch = useAppDispatch()
    const openDrawer = () => {
        dispatch(actions.mainMenu.openDrawer())
    }
    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: menuOpen,
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => openDrawer()}
                    edge="start"
                    className={clsx(classes.menuButton, {
                        [classes.hide]: menuOpen,
                    })}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    {headerTitle}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
