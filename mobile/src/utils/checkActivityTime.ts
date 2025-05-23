export function checkActivityTiming(scheduledDate: string | Date) {
  // Convert to Date object if it's a string
  const activityDate =
    typeof scheduledDate === 'string' ? new Date(scheduledDate) : scheduledDate;

  const now = new Date();

  // Verify if the activity date is today
  const isToday =
    activityDate.getDate() === now.getDate() &&
    activityDate.getMonth() === now.getMonth() &&
    activityDate.getFullYear() === now.getFullYear();

  // Verify if the activity date is in the past or today
  const isPastOrToday = activityDate.getTime() <= now.setHours(23, 59, 59, 999);

  // Calculate time difference
  const diffInMs = activityDate.getTime() - now.getTime();
  const diffInMinutes = diffInMs / 60000;

  return {
    isStartingSoon: diffInMinutes <= 30 && diffInMinutes > 0,
    hasStarted: diffInMinutes <= 0,
    remainingMinutes: Math.max(0, Math.floor(diffInMinutes)),
    scheduledDate: activityDate,

    isToday,
    isPastOrToday,
  };
}
