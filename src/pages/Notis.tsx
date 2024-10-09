import {
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useMutation, useQuery } from "react-query";

import { useNavigate } from "react-router-dom";
import { fetchNotis, putAllNotisRead, putNotiRead } from "../libs/fetcher";
import { queryClient } from "../ThemedApp";
import { Noti } from "../utils";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

export default function Notis() {
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery("notis", fetchNotis);

  console.log("Notis data >>>", data);

  const readAllNotis = useMutation(putAllNotisRead, {
    onMutate: async () => {
      await queryClient.cancelQueries("notis");
      queryClient.setQueryData<Noti[]>("notis", (old) => {
        return old!.map((noti) => {
          noti.read = true;
          return noti;
        });
      });
    },
  });

  const readNoti = useMutation((id: number) => putNotiRead(id));

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">
          {error instanceof Error && error.message}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}></Box>
        <Button
          size="small"
          variant="outlined"
          sx={{ borderRadius: 5 }}
          onClick={() => {
            readAllNotis.mutate();
          }}
        >
          Mark all as Read
        </Button>
      </Box>

      {data?.map((noti) => {
        return (
          <Card
            key={noti.id}
            sx={{
              mb: 2,
              opacity: noti.read ? 0.3 : 1,
            }}
          >
            <CardActionArea
              onClick={() => {
                readNoti.mutate(noti.id!);
                navigate(`/comments/${noti.postId}`);
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  opacity: 1,
                }}
              >
                {noti.type === "comment" ? (
                  <CommentIcon color="success" />
                ) : (
                  <FavoriteIcon color="error" />
                )}

                <Box
                  sx={{
                    ml: 3,
                  }}
                >
                  <Avatar />

                  <Box
                    sx={{
                      ml: 3,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        mr: 1,
                      }}
                    >
                      <b>{noti.user?.name}</b>
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                      }}
                    >
                      <b>{noti.content}</b>
                    </Typography>

                    <Typography component="span" color="primary">
                      <small>{format(noti.created!, "MMM dd, yyyy")}</small>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
