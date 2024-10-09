import {
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotiIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useApp } from "../utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchNotis } from "../libs/fetcher";

export default function Header() {
  const { showForm, setShowForm, mode, setMode, setShowDrawer, auth } =
    useApp();
  const navigate = useNavigate();

  // console.log('header')

  const { isLoading, isError, data } = useQuery(["notis", auth], fetchNotis);

  function notiCount() {
    if (!auth) return 0;
    if (isLoading || isError) return 0;

    return data?.filter((noti) => !noti.read).length;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setShowDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        >
          <IconButton onClick={() => navigate("/")}>Yaycha</IconButton>
        </Typography>

        <Box>
          <IconButton color="inherit" onClick={() => setShowForm(!showForm)}>
            <AddIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/profile-view")}>
            <RemoveRedEyeIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/history")}>
            <HistoryIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/search")}>
            <SearchIcon />
          </IconButton>
          {auth && (
            <IconButton color="inherit" onClick={() => navigate("/notis")}>
              <Badge color="error" badgeContent={notiCount()}>
                <NotiIcon />
              </Badge>
            </IconButton>
          )}

          {mode === "dark" ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("light")}
            >
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMode("dark")}
            >
              <DarkModeIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
