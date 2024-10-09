import { ChatBubbleOutline as CommentIcon } from "@mui/icons-material";
import { Post } from "../utils";
import { Button, ButtonGroup, IconButton } from "@mui/material";

export default function CommentButton({
  item,
  comment,
}: {
  item: Post;
  comment: boolean;
}) {
  return (
    <>
      {!comment && (
        <ButtonGroup sx={{ ml: 3 }}>
          <IconButton size="small">
            <CommentIcon fontSize="small" color="info" />
          </IconButton>
          <Button sx={{ color: "text.fade" }} variant="text" size="small">
            {item.comments?.length}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
