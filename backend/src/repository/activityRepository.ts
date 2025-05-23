import prisma from "../prisma/PrismaClient";
import { mapActivity } from "../service/activityService";
import activityAddressData from "../types/activityAddressData";
import activityData from "../types/activityData";

// The mapActivityWithUserId function makes easier the use of mapActivity function
// in contexts where you need to pass the userId along with each activity. This is
// especially useful when you are using the map function from an array, as it allows
// you to create a function that already has the userId predefined, simplifying the
// code and avoiding the need to manually pass the userId to each mapActivity call
// (in the return of functions).

// Higher-order function to pass userId to mapActivity
function mapActivityWithUserId(userId: string) {
  return (activity: any) => mapActivity(activity, userId);
}

// Get all activity types
export async function getAllActivityTypes() {
  return await prisma.activityType.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
    },
  });
}

// Get activities by creator
export async function getActivitiesByCreator(userId: string) {
  return await prisma.activity.findMany({
    where: {
      creatorId: userId,
      deletedAt: null,
    },
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          ActivityParticipant: true,
        },
      },
    },
  });
}

// Get activities by creator with pagination
export async function getActivitiesByCreatorPaginated(
  userId: string,
  take: number,
  skip: number
) {
  const activities = await prisma.activity.findMany({
    take,
    skip,
    where: {
      creatorId: userId,
      deletedAt: null,
    },
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          ActivityParticipant: true,
        },
      },
    },
  });

  const totalActivitiesCount = await prisma.activity.count({
    where: {
      creatorId: userId,
      completedAt: null,
    },
  });

  return { activities, totalActivitiesCount };
}

// Get all activities with filter by type and order
export async function getAllActivities(
  type?: string,
  orderByField?: string,
  direction?: "asc" | "desc"
) {
  const whereClause = {
    deletedAt: null,
    completedAt: null,
    ...(type && { type: { name: type } }),
  };

  const orderByClause = orderByField
    ? { [orderByField]: direction || "asc" }
    : { createdAt: "desc" };

  return await prisma.activity.findMany({
    where: whereClause,
    orderBy: orderByClause as any,
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          ActivityParticipant: true,
        },
      },
      ActivityParticipant: true,
    },
  });
}
// Get all activities with pagination, filter by type, and order
export async function getPaginatedActivities(
  take: number,
  skip: number,
  type?: string,
  orderBy?: string,
  order?: "asc" | "desc",
  userId?: string
) {
  const where = {
    ...(type ? { type: { name: { equals: type } } } : {}),
    deletedAt: null,
    completedAt: null,
  };

  const orderByClause = orderBy ? { [orderBy]: order } : { createdAt: "desc" };

  const activities = await prisma.activity.findMany({
    take,
    skip,
    where,
    orderBy: orderByClause as any,
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          ActivityParticipant: true,
        },
      },
      ActivityParticipant: true,
    },
  });

  const totalActivities = await prisma.activity.count({ where });

  return { activities, totalActivities };
}

// Get activities by participant with pagination
export async function getActivitiesByParticipantPaginated(
  userId: string,
  take: number,
  skip: number
) {
  const activities = await prisma.activity.findMany({
    take,
    skip,
    where: {
      ActivityParticipant: {
        some: {
          userId: userId,
        },
      },
      deletedAt: null,
    },
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          ActivityParticipant: true,
        },
      },
      ActivityParticipant: true,
    },
  });

  const totalActivitiesCount = await prisma.activity.count({
    where: {
      ActivityParticipant: {
        some: {
          userId: userId,
        },
      },
    },
  });

  return { activities, totalActivitiesCount };
}

// Get all activities by participant without pagination
export async function getActivitiesByParticipant(userId: string) {
  return await prisma.activity.findMany({
    where: {
      ActivityParticipant: {
        some: {
          userId: userId,
        },
      },
      deletedAt: null,
    },
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          ActivityParticipant: true,
        },
      },
      ActivityParticipant: true,
    },
  });
}

// Get activity participants by activity id
export async function getParticipantsByActivityId(activityId: string) {
  return await prisma.activityParticipant.findMany({
    where: { activityId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

// Create activity (/activity/new)
export async function createActivity(
  data: activityData,
  addressData?: activityAddressData
) {
  return await prisma.activity.create({
    data: {
      ...data,
      createdAt: new Date(),
      address: {
        create: {
          latitude: addressData?.latitude!,
          longitude: addressData?.longitude!,
        },
      },
    },
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      ActivityParticipant: true,
    },
  });
}

// Get activity by id
export async function getActivityById(id: string) {
  return await prisma.activity.findUnique({
    where: {
      id,
    },
    include: {
      ActivityParticipant: true,
    },
  });
}

// Get activity by title
export async function getActivityByTitle(title: string) {
  return await prisma.activity.findFirst({
    where: {
      title,
    },
  });
}

// Function to get user preferences
export async function getUserPreferences(userId: string) {
  return await prisma.preference.findMany({
    where: {
      userId: userId,
    },
    select: {
      typeId: true,
    },
  });
}

// Check if the user is already registered for the activity
export async function checkExistingParticipant(
  userId: string,
  activityId: string
) {
  return await prisma.activityParticipant.findFirst({
    where: {
      activityId: activityId,
      userId: userId,
    },
  });
}

// Subscribe for activity
export async function subscribeForActivity(
  userId: string,
  activityId: string,
  approved: boolean | null = null
) {
  return await prisma.activityParticipant.create({
    data: {
      activityId,
      userId,
      approved,
      confirmedAt: null,
    },
    select: {
      activityId: true,
      userId: true,
      approved: true,
      confirmedAt: true,
    },
  });
}

// Find activity by id (/activity/:id)
export async function getActivityTypeById(id: string) {
  return await prisma.activityType.findUnique({
    where: {
      id,
    },
  });
}

// Update activity
export async function updateActivity(
  id: string,
  title: string,
  description: string,
  typeId: string,
  image: string | undefined,
  scheduledDate: Date,
  isPrivate: boolean,
  addressData?: activityAddressData
) {
  const updatedActivity = await prisma.activity.update({
    where: { id },
    data: {
      title,
      description,
      typeId,
      image,
      scheduledDate,
      private: isPrivate,
    },
    include: {
      type: true,
      address: true,
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      ActivityParticipant: true,
    },
  });

  // Update the address for the activity if address data is provided
  if (addressData) {
    await prisma.activityAddress.upsert({
      where: { activityId: id },
      update: {
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      },
      create: {
        activityId: id,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      },
    });
  }

  return updatedActivity;
}
// Update activity completedAt
export async function updateCompletedAt(
  activityId: string,
  completedAt: Date | null
) {
  return await prisma.activity.update({
    where: { id: activityId },
    data: {
      completedAt: completedAt ? new Date() : null,
    },
  });
}

// Update the participant's approval status
export async function approveParticipant(
  activityId: string,
  participantId: string,
  approved: boolean
) {
  return await prisma.activityParticipant.update({
    where: {
      // Composite ID of activityId and userId
      // ("ActivityParticipant_unique_constraint") -> see on prisma.schema
      ActivityParticipant_unique_constraint: {
        activityId,
        userId: participantId,
      },
    },
    data: {
      approved,
    },
  });
}

// Check-in for an activity
export async function checkInActivity(userId: string, activityId: string) {
  return await prisma.activityParticipant.update({
    where: {
      ActivityParticipant_unique_constraint: {
        activityId,
        userId,
      },
    },
    data: {
      confirmedAt: new Date(),
    },
  });
}

// Unsubscribe from an activity
export async function unsubscribeActivity(userId: string, activityId: string) {
  return await prisma.activityParticipant.delete({
    where: {
      ActivityParticipant_unique_constraint: {
        activityId,
        userId,
      },
    },
  });
}

// Soft delete an activity
export async function deleteActivity(activityId: string) {
  return await prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

// This function is used to get the approved participants of an activity by the creator
export async function getApprovedParticipantsByCreator(creatorId: string) {
  return await prisma.activityParticipant.findMany({
    where: {
      approved: true,
      activity: {
        creatorId: creatorId,
      },
    },
  });
}
