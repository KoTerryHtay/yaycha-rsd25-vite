import { useNavigate } from "react-router-dom";
import { getToken } from "../libs/fetcher";
import { useQuery } from "react-query";
import { useApp, User } from "../utils";
import {
  Alert,
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import FollowButton from "../components/FollowButton";

const api = import.meta.env.VITE_API;

export default function ProfileViewer() {
  const token = getToken();
  const { auth } = useApp();

  const navigate = useNavigate();

  const { isError, isLoading, error, data } = useQuery<User, Error>(
    ["profileView", auth?.id],
    async () => {
      const res = await fetch(`${api}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    }
  );

  if (!data) return null;

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

  // console.log("data.viewFromUser data >>>", data);

  return (
    <>
      {data.profileViewFrom?.map((data) => (
        <ListItem key={data.id}>
          <ListItemButton
            onClick={() => navigate(`/profile/${data?.viewFromUser?.id}`)}
          >
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              primary={data.viewFromUser?.name}
              secondary={data.viewFromUser?.bio}
            />
            <ListItemSecondaryAction>
              <FollowButton user={data.viewFromUser!} />
            </ListItemSecondaryAction>
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
}
