export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
  }
};

export const scheduleDailyReminder = () => {
  // Schedule notification for 9 AM daily
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(9, 0, 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilReminder = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    sendNotification("Time to check your goals!", {
      body: "Don't break your streak! Complete today's tasks.",
      tag: "daily-reminder",
    });
    // Reschedule for next day
    scheduleDailyReminder();
  }, timeUntilReminder);
};

export const notifyTaskCompletion = (taskTitle: string) => {
  sendNotification("Task Completed! 🎉", {
    body: `Great job completing: ${taskTitle}`,
    tag: "task-complete",
  });
};

export const notifyStreakMilestone = (streakDays: number) => {
  sendNotification(`${streakDays} Day Streak! 🔥`, {
    body: "You're on fire! Keep the momentum going.",
    tag: "streak-milestone",
  });
};
