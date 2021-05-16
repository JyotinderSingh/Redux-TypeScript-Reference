import React from "react";
import { useAppSelector } from "../../hooks";
import { Link, RouteComponentProps } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { ReactionButtons } from "./ReactionButtons";
import { selectPostById } from "./postsSlice";

interface SinglePostPageMatchParams {
  postId: string;
}

interface SingePostPageProps
  extends RouteComponentProps<SinglePostPageMatchParams> {}

export const SinglePostPage: React.FC<SingePostPageProps> = ({ match }) => {
  const postId = match.params.postId;

  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user} />
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  );
};
