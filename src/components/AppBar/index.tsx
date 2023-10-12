import { Link as RouterLink } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Login from "../Login";


const PREFIX = 'index';

const classes = {
  appBar: `${PREFIX}-appBar`,
  title: `${PREFIX}-title`,
  toolbarIcon: `${PREFIX}-toolbarIcon`
};

const StyledMuiAppBar = styled(MuiAppBar)((
  {
    theme
  }
) => ({
  [`&.${classes.appBar}`]: {
    zIndex: theme.zIndex.drawer + 1,
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
  },

  [`& .${classes.toolbarIcon}`]: {
    ...theme.mixins.toolbar,
    position: "sticky",
    top: "0",
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.background.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
  }
}));

type AppBarProps = {
  darkMode: Boolean,
  toggleDarkMode: React.MouseEventHandler<HTMLElement>,
  setDrawerOpen: Function,
};

export default function AppBar(props: AppBarProps) {
  const theme = useTheme();

  return (
    <StyledMuiAppBar position="static" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => {
            props.setDrawerOpen(true);
          }}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          <RouterLink
            to="/"
            style={{
              color: theme.palette.text.primary,
              textDecoration: "none",
              marginLeft: "12px",
            }}
          >
            Pulpito
          </RouterLink>
        </Typography>
        <div>
          <Login />
        </div>
        <IconButton onClick={props.toggleDarkMode} size="large">
          {props.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </StyledMuiAppBar>
  );
}
