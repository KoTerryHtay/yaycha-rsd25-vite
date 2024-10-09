import { Alert, Box, Button, Typography } from "@mui/material";

import Form from "../components/Form";
import Item from "../components/Item";
import { Post, useApp } from "../utils";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../ThemedApp";
import {
  fetchFollowingPosts,
  fetchPosts,
  getToken,
  postPost,
} from "../libs/fetcher";
import { useState } from "react";

const api = import.meta.env.VITE_API;

export default function Home() {
  // const data = useLoaderData();

  const [showLatest, setShowLatest] = useState(true);

  const token = getToken();

  const { showForm, setGlobalMeg, auth } = useApp();

  const { isLoading, isError, error, data } = useQuery<Post[], Error>(
    ["posts", showLatest],
    async () => {
      if (showLatest) return fetchPosts();
      return fetchFollowingPosts();
    }
  );

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);
  // const [data, setData] = useState<Post[]>([]);

  /* useEffect(() => {
    fetch(`${api}/content/posts`)
      .then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as Post[];
          setData(data);
          setLoading(false);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);
  */

  // const [data, setData] = useState([
  //   { id: 3, content: "Yay, interesting.", name: "Chris" },
  //   { id: 2, content: "React is fun.", name: "Bob" },
  //   { id: 1, content: "Hello, World!", name: "Alice" },
  // ]);

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
        queryClient.setQueryData<Post[]>(["posts", showLatest], (old) =>
          old!.filter((item) => item.id !== id)
        );
        setGlobalMeg("An post deleted");
      },
    }
  );

  const add = useMutation(async (content: string) => postPost(content), {
    onSuccess: async (post) => {
      await queryClient.cancelQueries("posts");
      queryClient.setQueryData<Post[]>(
        ["posts", showLatest],
        (old) => [post, ...old!]
        // old ? [post, ...old] : [post];
      );
      setGlobalMeg("A post added");
    },
  });

  if (!data) return null;

  // console.log("posts data >>>", data);

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
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
      {showForm && auth && <Form add={add.mutate} />}

      {auth && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Button disabled={showLatest} onClick={() => setShowLatest(true)}>
            Latest
          </Button>
          <Typography sx={{ color: "text.fade", fontSize: 15 }}>|</Typography>
          <Button disabled={!showLatest} onClick={() => setShowLatest(false)}>
            Following
          </Button>
        </Box>
      )}

      {data.map((item) => {
        return <Item key={item.id} item={item} remove={remove.mutate} />;
      })}
    </Box>
  );
}
