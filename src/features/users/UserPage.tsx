import React from "react";

import { Link, RouteComponentProps } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { selectPostsByUser } from "../posts/postsSlice";
import { selectUserById } from "./usersSlice";

interface UserPageMatchParams {
  userId: string;
}

export interface UserPageProps
  extends RouteComponentProps<UserPageMatchParams> {}

export const UserPage: React.FC<UserPageProps> = ({ match }) => {
  const userId = match.params.userId;

  const user = useAppSelector((state) => selectUserById(state, userId));

  const postsForUser = useAppSelector((state) =>
    selectPostsByUser(state, userId)
  );

  if (!user) {
    return (
      <section>
        <h2>No user found</h2>
      </section>
    );
  }

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  );
};
