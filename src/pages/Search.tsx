import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { fetchSearch, getToken } from "../libs/fetcher";
import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import Item from "../components/Item";
import { Post, useApp, User } from "../utils";
import { queryClient } from "../ThemedApp";

const api = import.meta.env.VITE_API;

export default function Search() {
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const navigate = useNavigate();

  const token = getToken();

  const { setGlobalMeg } = useApp();

  // console.log("debouncedQuery >>>", debouncedQuery);

  const { isLoading, isError, error, data } = useQuery(
    ["search", debouncedQuery],
    () => fetchSearch(debouncedQuery)
  );

  const remove = useMutation(
    async (id: number) => {
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onMutate: (id: number) => {
        queryClient.cancelQueries("posts");
        queryClient.setQueryData<{
          users: User[];
          posts: Post[];
        }>(["search", debouncedQuery], (old) => {
          return {
            users: old!.users,
            posts: old!.posts!.filter((item) => item.id !== id),
          };
        });
        setGlobalMeg("An post deleted");
      },
    }
  );

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">
          {error instanceof Error && error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth={true}
        variant="outlined"
        placeholder="Search..."
        onKeyUp={(e) => {
          setQuery((e.target as HTMLInputElement).value);
        }}
      />
      {debouncedQuery ? (
        isLoading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>Loading...</Box>
        ) : (
          <>
            <List>
              {!!data?.users?.length && <Typography>Users</Typography>}
              {data?.users?.map((user) => (
                <ListItem key={user.id}>
                  <ListItemButton
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.bio} />
                    <ListItemSecondaryAction>
                      <FollowButton user={user} />
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <List>
              {!!data?.posts?.length && <Typography>Posts</Typography>}
              {data?.posts?.map((item) => (
                <Item key={item.id} item={item} remove={remove.mutate} />
              ))}
            </List>
          </>
        )
      ) : null}
    </Box>
  );
}
