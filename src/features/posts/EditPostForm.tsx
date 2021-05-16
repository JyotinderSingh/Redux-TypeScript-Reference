import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { postUpdated, selectPostById } from "./postsSlice";

interface EditPostPageMatchParams {
  postId: string;
}

interface EditPostPageProps
  extends RouteComponentProps<EditPostPageMatchParams> {}

export const EditPostForm: React.FC<EditPostPageProps> = ({ match }) => {
  const postId = match.params.postId;

  const post = useAppSelector((state) => selectPostById(state, postId));

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  const dispatch = useAppDispatch();
  const history = useHistory();

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        postUpdated({
          id: postId,
          title,
          content,
        })
      );
      history.push(`/posts/${postId}`);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="submit" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  );
};
