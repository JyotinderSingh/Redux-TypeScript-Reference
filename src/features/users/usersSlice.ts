import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";

export interface userInterface {
  name: string;
  id: string;
}

const initialState: userInterface[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/fakeApi/users");
  return response.users;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.push(...action.payload);
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export const selectUserById = (state: RootState, userId: string) =>
  state.users.find((user) => user.id === userId);

export default usersSlice.reducer;
