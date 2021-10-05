import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Toolbar,
  Typography,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Transactions from "./Components/Transactions";
import Projects from "./Components/Projects";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Reports";
import Settings from "./Components/Settings";
import "./index.css";
import "./reset.css";

const drawerWidth = 240;

const MainComp = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Main = () => {
  const states = [
    "Dashboard",
    "Transactions",
    "Reports",
    "Projects",
    "Settings",
  ];
  const [tab, settab] = useState(states[0]);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          marginBottom: "1%",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              ...(open && { display: "none" }),
            }}
          >
            Project Budget Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {states.map((text) => {
            return text === "Dashboard" ? (
              <ListItem disablePadding component={Link} to="/">
                <ListItemButton
                  onClick={() => settab(text)}
                  selected={tab === text}
                >
                  <ListItemText>{text}</ListItemText>
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem
                disablePadding
                component={Link}
                to={`/${text.toLowerCase()}`}
              >
                <ListItemButton
                  onClick={() => settab(text)}
                  selected={tab === text}
                >
                  <ListItemText>{text}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <MainComp open={open} id="MainComp">
        <Toolbar />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/Transactions" component={Transactions} />
          <Route exact path="/reports" component={Reports} />
          <Route exact path="/Projects" component={Projects} />
          <Route exact path="/settings" component={Settings} />
        </Switch>
      </MainComp>
    </Router>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
