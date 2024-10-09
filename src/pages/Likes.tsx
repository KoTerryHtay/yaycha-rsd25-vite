import { Alert, Box } from "@mui/material";
import UserList from "../components/UserList";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCommentLikes, fetchPostLikes } from "../libs/fetcher";

export default function Likes() {
  const { id, type } = useParams() as { id: string; type: "comment" };

  const { isLoading, isError, error, data } = useQuery(
    ["users", id, type],
    () => {
      if (type === "comment") {
        return fetchCommentLikes(Number(id));
      } else {
        return fetchPostLikes(Number(id));
      }
    }
  );

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">
          {error instanceof Error && error?.message}
        </Alert>
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

  return (
    <Box>
      <UserList title="Likes" data={data!} />
    </Box>
  );
}
