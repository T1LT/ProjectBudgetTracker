import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Reports";
import Settings from "./Components/Settings";
import "./index.css";
import "./reset.css";

const Main = () => {
  const states = [
    "Dashboard",
    "Transactions",
    "Reports",
    "Projects",
    "Settings",
  ];
  const [tab, settab] = useState(states[0]);
  return (
    <Router>
      <AppBar
        position="fixed"
        id="appbar"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Budget Tracker
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
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
              <ListItem disablePadding component={Link} to={`/${text}`}>
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
      <Box id="content">
        <Toolbar />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/Dashboard" component={Dashboard} />
          {/* <Route exact path="/Transactions" component={Transactions} /> */}
          <Route exact path="/Reports" component={Reports} />
          {/* <Route exact path="/Projects" component={Projects} /> */}
          <Route exact path="/Settings" component={Settings} />
        </Switch>
      </Box>
    </Router>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
