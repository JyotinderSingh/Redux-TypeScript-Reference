import React, { useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../hooks";
import classnames from "classnames";

import {
  selectAllNotifications,
  allNotificationsRead,
} from "./notificationsSlice";

import { selectAllUsers } from "../users/usersSlice";

export const NotificationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const users = useAppSelector(selectAllUsers);

  useEffect(() => {
    console.log("render");
    dispatch(allNotificationsRead());
  });

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find((user) => user.id === notification.user) || {
      name: "Unknown user",
    };

    const notificationClassname = classnames("notification", {
      new: notification.isNew,
    });

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b>
          {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    );
  });

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  );
};
