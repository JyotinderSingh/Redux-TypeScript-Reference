import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import { client } from "../../api/client";

export const fetchNotifications = createAsyncThunk<
  notificationInterface[],
  undefined,
  { dispatch: AppDispatch; state: RootState }
>("notifications/fetchNotifications", async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification ? latestNotification.date : "";
  const response = await client.get(
    `fakeApi/notifications?since=${latestTimestamp}`
  );
  return response.notifications;
});

export interface notificationInterface {
  id: string;
  date: string;
  user: string;
  message: string;
  read: boolean;
  isNew: boolean;
}

const initialState: notificationInterface[] = [];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    allNotificationsRead: (state) => {
      state.forEach((notification) => {
        notification.read = true;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.forEach((notification) => {
        // any notifications we've read are no longer new
        notification.isNew = !notification.read;
      });
      state.push(...action.payload);
      state.sort((a, b) => b.date.localeCompare(a.date));
    });
  },
});

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const selectAllNotifications = (state: RootState) => state.notifications;
