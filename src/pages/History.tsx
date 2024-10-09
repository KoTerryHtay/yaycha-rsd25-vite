import { useQuery } from "react-query";
import { HistoryInterface, useApp } from "../utils";
import { Alert, Box } from "@mui/material";
import { getToken } from "../libs/fetcher";
import LogComponent from "../components/LogComponent";

const api = import.meta.env.VITE_API;

export default function History() {
  const { auth } = useApp();
  const token = getToken();

  const { isError, isLoading, data, error } = useQuery<
    HistoryInterface[],
    Error
  >(["history", auth], async () => {
    const res = await fetch(`${api}/history`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  });

  if (isError) {
    return (
      <Box>
        <Alert>{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        Loading...
      </Box>
    );
  }

  // console.log("history data >>>", data);

  return (
    <Box>
      <Box>History</Box>
      {data?.map((history) => (
        <LogComponent key={history.id} data={history} />
      ))}
    </Box>
  );
}
