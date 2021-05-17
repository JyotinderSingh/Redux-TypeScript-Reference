import {
  createSelector,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";
import { reactionEmoji } from "./ReactionButtons";

type reactionsType = Record<reactionEmoji, number>;

export interface postInterface {
  id: string;
  title: string;
  content: string;
  user: string;
  date: string;
  reactions: reactionsType;
}

export interface postStateInterface {
  posts: postInterface[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}

// Defines the initial values in the store
const initialState: postStateInterface = {
  posts: [],
  status: "idle",
  error: undefined,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/fakeApi/posts");
  return response.posts;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  // The payload creator receives the partial `{title, content, user} object
  async (initialPost: { title: string; content: string; user: string }) => {
    // we sed the initial data to the fake API serve
    const response = await client.post("/fakeApi/posts", { post: initialPost });
    // The response includes the complete post object, including a unique ID
    return response.post;
  }
);

// createSlice prepares our actions and reducers
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // // reducer to add a new post based on a payload
    // postAdded: {
    //   reducer: (state, action: PayloadAction<postInterface>) => {
    //     state.posts.push(action.payload);
    //   },
    //   // The prepare function takes in the required user defined paramters
    //   // and prepares the final payload to be sent to the reducer
    //   prepare: ({
    //     title,
    //     content,
    //     user,
    //   }: {
    //     title: string;
    //     content: string;
    //     user: string;
    //   }): { payload: postInterface } => {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //         user: user,
    //         date: new Date().toISOString(),
    //         reactions: DEFAULT_REACTION_STATE,
    //       },
    //     };
    //   },
    // },

    // reducer to update an existing post
    postUpdated: (
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>
    ) => {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },

    // reducer to add a reaction to a post
    reactionAdded: (
      state,
      action: PayloadAction<{
        postId: string;
        reaction: reactionEmoji;
      }>
    ) => {
      const { postId, reaction } = action.payload;
      console.log(reaction);
      const exisitingPost = state.posts.find((post) => post.id === postId);
      if (exisitingPost) {
        exisitingPost.reactions[reaction]++;
      }
    },
  },
  // extraReducers help us catch actions that were not defined inside the createSlice reducers
  // for instance actions defined as async thunks
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.status = "loading";
      state.error = undefined;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the posts state array
      state.posts = state.posts.concat(action.payload);
      state.error = undefined;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      // we can directly add the new post object to our posts array
      state.posts.push(action.payload);
    });
  },
});

// exporting the generated actions
export const { postUpdated, reactionAdded } = postsSlice.actions;

// exporting the combined reducer for the posts topic
export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts.posts;

export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);

export const selectPostsByUser = createSelector(
  // In this case, we know that we need the array of all posts and the user ID
  // as the two arguments for our output selector. We can reuse our existing
  // selectAllPosts selector to extract the posts array.
  // Since the user ID is the second argument we're passing into selectPostsByUser,
  //  we can write a small selector that just returns userId.
  [selectAllPosts, (state: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
);
