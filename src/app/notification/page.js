"use client";
import { useState } from "react";

const NotificationButton = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermission(permission);
  };

  const sendNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Hello!", {
        body: "This is a test notification.",
        icon: "/images/brand/images.png",
      });
    } else {
      alert("Notification permission denied.");
    }
  };

  return (
    <div>
      {permission !== "granted" && (
        <button onClick={requestPermission}>
          Request Notification Permission
        </button>
      )}
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default NotificationButton;
