import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import QueryBuilder from '@material-ui/icons/QueryBuilder';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { actions } from '../../store/actions';
import { Receipt } from '@material-ui/icons';

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

export default function MenuDrawer() {
  const classes = useStyles();

  const menuOpen = useAppSelector(state => state.mainMenu.open)
  const dispatch = useAppDispatch()
  const closeDrawer = () => {
      dispatch(actions.mainMenu.closeDrawer())
  }
  return (<Drawer
    variant="permanent"
    className={clsx(classes.drawer, {
      [classes.drawerOpen]: menuOpen,
      [classes.drawerClose]: !menuOpen,
    })}
    classes={{
      paper: clsx({
        [classes.drawerOpen]: menuOpen,
        [classes.drawerClose]: !menuOpen,
      }),
    }}
  >
    <div className={classes.toolbar}>
      <IconButton onClick={() => closeDrawer()}>
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <Divider />
    <List>
      <ListItem button component={Link} to="/work-log">
        <ListItemIcon><QueryBuilder /></ListItemIcon>
        <ListItemText primary={"Work Log"} />
      </ListItem>
    </List>
    <List>
      <ListItem button component={Link} to="/scrum">
        <ListItemIcon><Receipt /></ListItemIcon>
        <ListItemText primary={"Scrum Generator"} />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem button component={Link} to="/settings">
        <ListItemIcon><SettingsIcon /></ListItemIcon>
        <ListItemText primary={"Settings"} />
      </ListItem>
    </List>
  </Drawer>
  );
}
