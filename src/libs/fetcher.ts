import {
  Comment,
  CommentLikeInterface,
  Follow,
  loginUser,
  Msg,
  Noti,
  Post,
  PostLike,
  User,
} from "../utils";

const api = import.meta.env.VITE_API;

export function getToken() {
  return localStorage.getItem("token");
}

export async function fetchPosts() {
  const res = await fetch(`${api}/content/posts`);

  return res.json() as unknown as Post[];
}

export async function postUser(data: Partial<User>) {
  const res = await fetch(`${api}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json() as unknown as User;
  }

  throw new Error("Error: Check Network Log");
}

export async function postLogin(username: string, password: string) {
  const res = await fetch(`${api}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json() as unknown as loginUser;
  }

  throw new Error("Incorrect username or password");
}

export async function fetchUser(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as User;
}

export async function fetchVerify() {
  const token = getToken();

  if (!token) return false;

  const res = await fetch(`${api}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return res.json() as unknown as User;
  }

  return false;
}

export async function postPost(content: string) {
  const token = getToken();

  const res = await fetch(`${api}/content/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return res.json() as unknown as Post;
  }

  throw new Error("Error: Check Network Log");
}

export async function postComment(content: string, postId: number) {
  const token = getToken();

  const res = await fetch(`${api}/content/comments`, {
    method: "POST",
    body: JSON.stringify({ content, postId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return res.json() as unknown as Comment;
  }

  throw new Error("Error: Check Network Log");
}

export async function postPostLike(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/content/like/posts/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as PostLike;
}

export async function postCommentLike(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/content/like/comments/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as CommentLikeInterface;
}

export async function deletePostLike(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/content/unlike/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Msg;
}

export async function deleteCommentLike(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/content/unlike/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Msg;
}

export async function fetchPostLikes(id: number) {
  const res = await fetch(`${api}/content/like/posts/${id}`);

  return res.json() as unknown as PostLike[];
}

export async function fetchCommentLikes(id: number) {
  const res = await fetch(`${api}/content/like/comments/${id}`);

  return res.json() as unknown as CommentLikeInterface[];
}

export async function postFollow(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/follow/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Follow;
}

export async function deleteFollow(id: number) {
  const token = getToken();

  const res = await fetch(`${api}/unfollow/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Msg;
}

export async function fetchSearch(q: string) {
  const res = await fetch(`${api}/search?q=${q}`);

  return res.json() as unknown as { users?: User[]; posts?: Post[] };
}

export async function fetchFollowingPosts() {
  const token = getToken();

  const res = await fetch(`${api}/content/following/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Post[];
}

export async function fetchNotis() {
  const token = getToken();

  const res = await fetch(`${api}/content/notis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Noti[];
}

export async function putAllNotisRead() {
  const token = getToken();

  const res = await fetch(`${api}/content/notis/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Msg;
}

export async function putNotiRead(id: number) {
  const token = getToken();
  const res = await fetch(`${api}/content/notis/read/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json() as unknown as Noti;
}
