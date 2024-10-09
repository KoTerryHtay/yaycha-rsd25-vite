import { Box, Container, Snackbar } from "@mui/material";
import Header from "./components/Header";
import AppDrawer from "./components/AppDrawer";
import { Outlet } from "react-router-dom";
import { useApp } from "./utils";

export default function Template() {
  const { globalMeg, setGlobalMeg } = useApp();

  return (
    <Box>
      <Header />
      <AppDrawer />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Outlet />
      </Container>

      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={Boolean(globalMeg)}
        autoHideDuration={6000}
        onClose={() => setGlobalMeg("")}
        message={globalMeg}
      />
    </Box>
  );
}
