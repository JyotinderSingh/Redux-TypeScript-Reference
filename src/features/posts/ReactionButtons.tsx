import React from "react";
import { useAppDispatch } from "../../hooks";
import { postInterface, reactionAdded } from "./postsSlice";

export enum reactionEmoji {
  thumbsUp = "THUMBSUP",
  hooray = "HOORAY",
  heart = "HEART",
  rocket = "ROCKET",
  eyes = "EYES",
}

export const reactionEmojiMapping: Record<reactionEmoji, string> = {
  THUMBSUP: "👍",
  HOORAY: "🎉",
  ROCKET: "🚀",
  HEART: "❤️",
  EYES: "👀",
};

interface ReactionButtonsProps {
  post: postInterface;
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({ post }) => {
  const dispatch = useAppDispatch();

  const reactionButtons = Object.keys(reactionEmojiMapping).map((reaction) => {
    return (
      <button
        key={reaction}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          dispatch(
            reactionAdded({
              postId: post.id,
              reaction: reaction as reactionEmoji,
            })
          )
        }
      >
        {reactionEmojiMapping[reaction]} {post.reactions[reaction]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};
