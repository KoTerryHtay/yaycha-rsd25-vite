import { Alert, Box, Button, TextField } from "@mui/material";
import Item from "../components/Item";
import { useNavigate, useParams } from "react-router-dom";
import { Post, useApp } from "../utils";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../ThemedApp";
import { getToken, postComment } from "../libs/fetcher";
import { useRef } from "react";

const api = import.meta.env.VITE_API;

export default function Comments() {
  const { id } = useParams();
  const token = getToken();

  const contentInput = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const { setGlobalMeg, auth } = useApp();

  const { isLoading, isError, error, data } = useQuery<Post, Error>(
    "comments",
    async () => {
      const res = await fetch(`${api}/content/posts/${id}`);
      return res.json();
    }
  );

  const removePost = useMutation(async (id: number) => {
    await fetch(`${api}/content/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/");
    setGlobalMeg("A post deleted");
  });

  const removeComment = useMutation(
    async (id: number) => {
      await fetch(`${api}/content/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onMutate: (id: number) => {
        queryClient.cancelQueries("comments");
        queryClient.setQueryData<Post>("comments", (old) => {
          old!.comments = old!.comments!.filter((comment) => comment.id !== id);

          return { ...old };
        });

        setGlobalMeg("A comment deleted");
      },
    }
  );

  const addComment = useMutation(
    (content: string) => postComment(content, Number(id)),
    {
      onSuccess: async (comment) => {
        await queryClient.cancelQueries("comments");
        await queryClient.setQueryData<Post>("comments", (old) => {
          old!.comments = [...old!.comments!, comment];
          return { ...old };
        });
        setGlobalMeg("A comment added");
      },
    }
  );

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

  return (
    <Box>
      <Item primary key={1} item={data!} remove={removePost.mutate} />

      {data?.comments?.map((comment) => {
        return (
          <Item
            comment
            key={comment.id}
            item={comment}
            remove={removeComment.mutate}
          />
        );
      })}

      {auth && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = contentInput.current?.value;

            if (!content) return false;

            addComment.mutate(content);

            e.currentTarget.reset();
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 3,
            }}
          >
            <TextField
              inputRef={contentInput}
              placeholder="Your Comment"
              multiline
            />
            <Button type="submit" variant="contained">
              Reply
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
