import { useEffect, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import { AppContext, Mode, User } from "./utils";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from "./Template";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Comments from "./pages/Comments";
import Likes from "./pages/Likes";
import { QueryClient, QueryClientProvider } from "react-query";
import { fetchVerify } from "./libs/fetcher";
import Search from "./pages/Search";
import Notis from "./pages/Notis";
import AppSocket from "./AppSocket";
import ProfileViewer from "./pages/ProfileViewer";
import History from "./pages/History";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        element: <Home />,
        // loader: async () => {},
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile-view",
        element: <ProfileViewer />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/likes/:id/:type",
        element: <Likes />,
      },
      {
        path: "/comments/:id",
        element: <Comments />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/notis",
        element: <Notis />,
      },
    ],
  },
]);

// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient();

export default function ThemedApp() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [globalMeg, setGlobalMeg] = useState("");
  const [auth, setAuth] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    fetchVerify().then((user) => {
      if (user) setAuth(user);
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: deepPurple,
          banner: mode === "dark" ? grey[800] : grey[200],
          text: {
            fade: grey[500],
          },
        },
      }),
    [mode]
  );
  // <Box sx={{ bgcolor: "banner" }}></Box>
  // <Typography sx={{ color: "text.fade" }}></Typography>

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          showForm,
          setShowForm,
          mode,
          setMode,
          showDrawer,
          setShowDrawer,
          globalMeg,
          setGlobalMeg,
          auth,
          setAuth,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <AppSocket />
        </QueryClientProvider>

        {/*
         <App />
        <AppDrawer />

        <Snackbar
          anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
          }}
          open={Boolean(globalMeg)}
          autoHideDuration={6000}
          onClose={() => setGlobalMeg("")}
          message={globalMeg}
        /> */}

        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
