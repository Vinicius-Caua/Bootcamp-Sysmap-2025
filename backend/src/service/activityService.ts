import { ServerError } from "../errors/serverError";
import {
  approveParticipant,
  checkExistingParticipant,
  checkInActivity,
  createActivity,
  deleteActivity,
  getActivitiesByCreator,
  getActivitiesByCreatorPaginated,
  getActivitiesByParticipant,
  getActivitiesByParticipantPaginated,
  getActivityById,
  getActivityByTitle,
  getActivityTypeById,
  getAllActivities,
  getAllActivityTypes,
  getApprovedParticipantsByCreator,
  getPaginatedActivities,
  getParticipantsByActivityId,
  subscribeForActivity,
  unsubscribeActivity,
  updateActivity,
  updateCompletedAt,
} from "../repository/activityRepository";
import { getById, getUserPreferences } from "../repository/userRepository";
import activityAddressData from "../types/activityAddressData";
import activityData from "../types/activityData";
import createActivityValidation from "../validations/activity/CreateActivityValidation";
import updateActivityValidation from "../validations/activity/updateActivityValidation";
import { addXPAndCheckLevel } from "./achievementService";
import { grantAchievement } from "./userAchievementService";

// Function to map participant data to a more readable format
export function mapParticipant(participant: any) {
  return {
    id: participant.activityId,
    userId: participant.user.id,
    name: participant.user.name,
    avatar: participant.user.avatar,
    subscriptionStatus:
      participant.approved === true
        ? "approved"
        : participant.approved === null // check if approved is null
        ? "pending"
        : "disapproved", // approved false
    confirmedAt: participant.confirmedAt,
  };
}

// Function to map activity data to a more readable format
export function mapActivity(activity: any, userId: string) {
  // Find the participant data for the current user
  const userParticipant = activity.ActivityParticipant?.find(
    (p: any) => p.userId === userId
  );

  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.type.name,
    image: activity.image,
    confirmationCode: activity.confirmationCode,
    participantCount: activity._count?.ActivityParticipant || 0,
    address: activity.address
      ? {
          latitude: activity.address.latitude,
          longitude: activity.address.longitude,
        }
      : null,
    scheduledDate: activity.scheduledDate,
    createdAt: activity.createdAt,
    completedAt: activity.completedAt,
    private: activity.private,
    creator: {
      id: activity.creator.id,
      name: activity.creator.name,
      avatar: activity.creator.avatar,
    },
    userSubscriptionStatus:
      activity.creator.id === userId // Check if the user is the creator
        ? "creator"
        : userParticipant // Check if the user is a participant
        ? userParticipant.approved === true
          ? "approved" // Approved by the creator
          : userParticipant.approved === null
          ? "pending" // Waiting for approval
          : "disapproved" // Rejected by the creator
        : "not_subscribed", // User is not subscribed
  };
}

// Function to generate a random confirmation code
export function generateConfirmationCode(length: number = 5): string {
  // Characters to be used in the code
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!*&%";
  let result = "";
  // Generate the code
  for (let i = 0; i < length; i++) {
    // Get a random character from the list and add it to the result
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to parse the address string
export function parseAddress(rawAddress: string): activityAddressData {
  // Remove spaces and braces
  const cleaned = rawAddress.replace(/[{}]/g, "").trim();

  // Divide the string into latitude and longitude
  const parts = cleaned.split(/\s*,\s*/);

  if (parts.length !== 2) {
    // Check if the string has two parts
    throw new ServerError("Formato inválido. Use {latitude, longitude}", 400);
  }

  const latitude = parseFloat(parts[0]); // Convert to number
  const longitude = parseFloat(parts[1]); // Convert to number

  if (isNaN(latitude) || isNaN(longitude)) {
    // Check if the values are valid numbers
    throw new ServerError("Valores devem ser números válidos", 400);
  }

  return { latitude, longitude, activityId: "" }; // Return the address object
}

// Function to generate pagination metadata
export function generatePaginationMetadata(
  take: number,
  skip: number,
  currentActivitiesCount: number,
  totalActivitiesCount: number
) {
  return {
    page: Math.floor(skip / take), // Current page
    pageSize: take, // Number of activities per page
    totalActivities: currentActivitiesCount, // Total number of activities on the current page
    totalPages: Math.ceil(totalActivitiesCount / take), // Total number of pages
    previous: skip > 0 ? skip - take : null, // Previous page
    next: skip + take < totalActivitiesCount ? skip + take : null, // Next page
  };
}

export const activityService = {
  // Get all activity types
  async getAllActivityTypes() {
    return await getAllActivityTypes();
  },

  // Get all activities with filter and order
  async getAllActivities(
    userId: string,
    type?: string,
    orderBy?: string,
    order?: "asc" | "desc"
  ) {
    // Get user preferences to prioritize activities
    const preferences = await getUserPreferences(userId);
    // Get the type names from the preferences array
    const preferenceTypes = preferences.map(
      (preference) => preference.typeName
    );
    // Get all activities with the provided filters
    const activities = await getAllActivities(type, orderBy, order);

    // Prioritize activities based on user preferences
    const sortedActivities = activities.sort((a, b) => {
      const aIndex = preferenceTypes.indexOf(a.type.name);
      const bIndex = preferenceTypes.indexOf(b.type.name);

      if (aIndex === -1 && bIndex === -1) return 0; // Both types are not in preferences
      if (aIndex === -1) return 1; // a.type is not in preferences, b.type is
      if (bIndex === -1) return -1; // b.type is not in preferences, a.type is

      return aIndex - bIndex; // Both types are in preferences, sort by their order in preferences
    });

    // Return formatted activities
    return sortedActivities.map((activity) => mapActivity(activity, userId));
  },

  // Get paginated activities
  async getPaginatedActivities(
    userId: string,
    take: number,
    skip: number,
    type?: string,
    orderBy?: string,
    order?: "asc" | "desc"
  ) {
    // Get user preferences to prioritize activities
    const preferences = await getUserPreferences(userId);
    const preferenceTypes = preferences.map(
      (preference) => preference.typeName
    );

    // Fetch activities from the repository
    const { activities, totalActivities } = await getPaginatedActivities(
      take,
      skip,
      type,
      orderBy,
      order,
      userId
    );

    // Prioritize activities based on user preferences
    const sortedActivities = activities.sort((a, b) => {
      const aIndex = preferenceTypes.indexOf(a.type.name);
      const bIndex = preferenceTypes.indexOf(b.type.name);

      if (aIndex === -1 && bIndex === -1) return 0; // Both types are not in preferences
      if (aIndex === -1) return 1; // a.type is not in preferences, b.type is
      if (bIndex === -1) return -1; // b.type is not in preferences, a.type is

      return aIndex - bIndex; // Both types are in preferences, sort by their order in preferences
    });

    return {
      ...generatePaginationMetadata(
        take,
        skip,
        sortedActivities.length,
        totalActivities
      ),
      activities: sortedActivities.map((activity) =>
        mapActivity(activity, userId)
      ),
    };
  },

  // Get activities by creator with pagination
  async getActivitiesByCreatorPaginated(
    userId: string,
    take: number,
    skip: number
  ) {
    // Buscar atividades no repositório
    const { activities, totalActivitiesCount } =
      await getActivitiesByCreatorPaginated(userId, take, skip);

    // Return formatted activities with pagination metadata
    return {
      ...generatePaginationMetadata(
        take,
        skip,
        activities.length,
        totalActivitiesCount
      ),
      activities: activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.type.name,
        image: activity.image,
        confirmationCode: activity.confirmationCode,
        participantCount: activity._count?.ActivityParticipant || 0,
        address: activity.address
          ? {
              latitude: activity.address.latitude,
              longitude: activity.address.longitude,
            }
          : null,
        scheduledDate: activity.scheduledDate,
        createdAt: activity.createdAt,
        completedAt: activity.completedAt,
        private: activity.private,
        creator: {
          id: activity.creator.id,
          name: activity.creator.name,
          avatar: activity.creator.avatar,
        },
      })),
    };
  },

  // Get activities by creator without pagination
  async getActivitiesByCreator(userId: string) {
    const activities = await getActivitiesByCreator(userId);
    return activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      type: activity.type.name,
      image: activity.image,
      confirmationCode: activity.confirmationCode,
      participantCount: activity._count?.ActivityParticipant || 0,
      address: activity.address
        ? {
            latitude: activity.address.latitude,
            longitude: activity.address.longitude,
          }
        : null,
      scheduledDate: activity.scheduledDate,
      createdAt: activity.createdAt,
      completedAt: activity.completedAt,
      private: activity.private,
      creator: {
        id: activity.creator.id,
        name: activity.creator.name,
        avatar: activity.creator.avatar,
      },
    }));
  },

  // Get activities by participant paginated
  async getActivitiesByParticipantPaginated(
    userId: string,
    take: number,
    skip: number
  ) {
    // Find activities in the repository
    const { activities, totalActivitiesCount } =
      await getActivitiesByParticipantPaginated(userId, take, skip);

    // Return formatted activities with pagination metadata
    return {
      ...generatePaginationMetadata(
        take,
        skip,
        activities.length,
        totalActivitiesCount
      ),
      activities: activities.map((activity) => mapActivity(activity, userId)),
    };
  },

  // Get activities by participant without pagination
  async getActivitiesByParticipant(userId: string) {
    const activities = await getActivitiesByParticipant(userId);
    return activities.map((activity) => mapActivity(activity, userId));
  },

  // Get participants by activity id
  async getParticipantsByActivityId(activityId: string) {
    if (!activityId) {
      throw new ServerError("Atividade não encontrada.", 404);
    }
  
    // Fetch the activity by ID
    const activity = await getActivityById(activityId);
  
    // Check if the activity exists
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }
  
    // Check if the activity is deleted
    if (activity.deletedAt) {
      throw new ServerError(
        "Não é possível acessar uma atividade deletada.",
        400
      );
    }
  
    // Fetch participants for the activity
    const participants = await getParticipantsByActivityId(activityId);
  
    // If there are no participants, return an empty array
    if (!participants || participants.length === 0) {
      return [];
    }
  
    
    // Map participants to a readable format
    return participants.map(mapParticipant);
  },

  // Create a new activity
  async createActivity(
    userId: string,
    data: activityData,
    address: activityAddressData
  ) {
    // Validate activity data
    const validatedData = createActivityValidation.parse({
      ...data,
      address,
    });

    // Generate a confirmation code
    const confirmationCode = generateConfirmationCode();

    // Verify if the typeId exists
    const activityType = await getActivityTypeById(data.typeId);
    if (!activityType) {
      throw new ServerError("O tipo de atividade fornecido é inválido.", 400);
    }

    // Include the image URL if provided
    const imageUrl = data.image ? data.image : undefined;

    // Validate address data
    if (
      !address ||
      !validatedData.address.latitude ||
      !validatedData.address.longitude
    ) {
      throw new ServerError(
        "O endereço é obrigatório e deve conter latitude e longitude.",
        400
      );
    }

    // Validate if activity title is unique
    const existingActivity = await getActivityByTitle(data.title);
    if (existingActivity) {
      throw new ServerError("Já existe uma atividade com esse título.", 400);
    }

    const newActivity = await createActivity(
      {
        ...validatedData,
        confirmationCode,
        creatorId: userId,
        createdAt: new Date(),
        image: imageUrl,
      },
      validatedData.address
    );

    // Grant the "A Primeira de Muitas" achievement if this is the user's first activity
    await grantAchievement("A Primeira de Muitas", userId, 300);

    // Grant the "Criador de Atividades" achievement if this is the user's third activity
    const activitiesByCreator = await getActivitiesByCreator(userId);
    if (activitiesByCreator.length === 3) {
      await grantAchievement("Criador de Atividades", userId, 200);
    }

    return {
      id: newActivity.id,
      title: newActivity.title,
      description: newActivity.description,
      type: newActivity.type.name,
      image: newActivity.image,
      address: newActivity.address
        ? {
            latitude: newActivity.address.latitude,
            longitude: newActivity.address.longitude,
          }
        : null,
      scheduledDate: newActivity.scheduledDate,
      createdAt: newActivity.createdAt,
      completedAt: newActivity.completedAt,
      private: newActivity.private,
      creator: {
        id: newActivity.creator.id,
        name: newActivity.creator.name,
        avatar: newActivity.creator.avatar,
      },
    };
  },

  // Subscribe for activity
  async subscribeForActivity(userId: string, activityId: string) {
    // Check if the activity exists and is not deleted or completed
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }

    if (activity.deletedAt || activity.completedAt) {
      throw new ServerError(
        "Você não pode se inscrever em uma atividade que foi desativada ou completada.",
        400
      );
    }

    // Check if the user is the creator of the activity
    if (activity.creatorId === userId) {
      throw new ServerError(
        "Você não pode se inscrever na sua própria atividade.",
        400
      );
    }

    // Check if the user is already registered for the activity
    const existingParticipant = await checkExistingParticipant(
      userId,
      activityId
    );
    if (existingParticipant) {
      if (existingParticipant.confirmedAt) {
        throw new ServerError("Você já fez o Check-In nessa atividade.", 400);
      }
      throw new ServerError("Você já se inscreveu nessa atividade.", 400);
    }

    // Determine the subscription status based on the activity's privacy setting
    const approved = activity.private ? null : true;
    const subscription = await subscribeForActivity(
      userId,
      activityId,
      approved
    );

    // Count the number of activities the user is subscribed to
    const participantActivities = await getActivitiesByParticipant(userId);

    // Grant the "Está 'Inscrito' nas Estrelas" achievement if the user is subscribed to 10 activities
    if (participantActivities.length === 10) {
      await grantAchievement("Está 'Inscrito' nas Estrelas", userId, 500);
    }

    return {
      id: `${subscription.activityId}_${subscription.userId}`,
      subscriptionStatus: approved === null ? "pending" : "subscribed",
      confirmedAt: subscription.confirmedAt,
      activityId: subscription.activityId,
      userId: subscription.userId,
    };
  },

  // Update activity
  async updateActivity(
    userId: string,
    id: string,
    activityData: {
      title?: string;
      description?: string;
      typeId?: string;
      image?: string;
      scheduledDate?: Date;
      private?: boolean;
      addressData?: activityAddressData;
    }
  ) {
    // Validate activity data
    const validatedData = updateActivityValidation.parse({
      title: activityData.title,
      description: activityData.description,
      typeId: activityData.typeId,
      scheduledDate: activityData.scheduledDate,
      address: activityData.addressData,
      private: activityData.private,
    });

    // Check if the activity exists
    const activity = await getActivityById(id);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }

    // Check if the user is the creator of the activity
    if (activity.creatorId !== userId) {
      throw new ServerError(
        "Você não tem permissão para atualizar esta atividade.",
        403
      );
    }

    // Verify if the typeId exists
    if (validatedData.typeId && validatedData.typeId !== activity.typeId) {
      const activityType = await getActivityTypeById(validatedData.typeId);
      if (!activityType) {
        throw new ServerError("O tipo de atividade fornecido é inválido.", 400);
      }
    }

    // Validate if activity title is unique
    if (
      validatedData.title &&
      validatedData.title.trim() !== activity.title.trim() // Check if the title has changed
    ) {
      const existingActivity = await getActivityByTitle(validatedData.title);
      if (existingActivity) {
        throw new ServerError("Já existe uma atividade com esse título.", 400);
      }
    }

    // Validate data and create an object with the updated fields
    // Only update the fields that are provided
    const updateData: any = {};
    if (validatedData.title !== undefined)
      updateData.title = validatedData.title;
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.typeId !== undefined)
      updateData.typeId = validatedData.typeId;
    if (validatedData.scheduledDate !== undefined)
      updateData.scheduledDate = validatedData.scheduledDate;
    if (validatedData.private !== undefined)
      updateData.private = validatedData.private;
    if (validatedData.address !== undefined)
      updateData.address = validatedData.address;
    if (activityData.image !== undefined) updateData.image = activityData.image;

    // Update the activity in the repository
    const updatedActivity = await updateActivity(
      id,
      updateData.title,
      updateData.description,
      updateData.typeId,
      updateData.image,
      updateData.scheduledDate,
      updateData.private,
      updateData.address
    );

    // Return the updated activity in the desired format
    return {
      id: updatedActivity.id,
      title: updatedActivity.title,
      description: updatedActivity.description,
      type: updatedActivity.type.name,
      image: updatedActivity.image,
      address: updatedActivity.address
        ? {
            latitude: updatedActivity.address.latitude,
            longitude: updatedActivity.address.longitude,
          }
        : null,
      scheduledDate: updatedActivity.scheduledDate,
      createdAt: updatedActivity.createdAt,
      completedAt: updatedActivity.completedAt,
      private: updatedActivity.private,
      creator: {
        id: updatedActivity.creator.id,
        name: updatedActivity.creator.name,
        avatar: updatedActivity.creator.avatar,
      },
    };
  },

  // Update activity to completed
  async completeActivity(userId: string, activityId: string) {
    // Check if the activity exists
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }

    // Check if the user is the creator of the activity
    if (activity.creatorId !== userId) {
      throw new ServerError(
        "Você não tem permissão para completar esta atividade.",
        403
      );
    }

    // Check if the activity is already completed
    if (activity.completedAt) {
      throw new ServerError("Esta atividade já foi concluída.", 400);
    }

    // Grant the "Tudo que Começa tem um Fim" achievement to the creator
    await grantAchievement("Tudo que Começa tem um Fim", userId, 150);

    // Add XP to the creator of the activity
    await addXPAndCheckLevel(userId, 100); // Add 100 XP to the creator

    // Get all participants who have checked in
    const participants = await getParticipantsByActivityId(activityId);
    const participantsWithCheckIn = participants.filter(
      (participant) => participant.confirmedAt !== null
    );

    // Add XP to all participants who have checked in
    for (const participant of participantsWithCheckIn) {
      await addXPAndCheckLevel(participant.userId, 50); // Add 50 XP to each participant
    }

    // Mark the activity as completed
    return await updateCompletedAt(activityId, new Date());
  },

  // Approve or deny a participant in a private activity
  async approveParticipant(
    userId: string,
    activityId: string,
    participantId: string,
    approved: boolean
  ) {
    // Check if the activity exists
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }

    // Check if the user is the creator of the activity
    if (activity.creatorId !== userId) {
      throw new ServerError(
        "Você não tem permissão para aprovar ou negar esta participação.",
        403
      );
    }
    // Validate if participantId exists
    const participant = await getById(participantId);
    if (!participant) {
      throw new ServerError("Participante não encontrado.", 404);
    }

    // Check if the participant exists in the activity
    const participantInTheActivity = await checkExistingParticipant(
      participantId,
      activityId
    );

    // Check if the participant is registered for the activity
    if (!participantInTheActivity) {
      throw new ServerError("Participante não encontrado.", 404);
    }

    // Check if the participant is already confirmed
    if (participantInTheActivity.confirmedAt) {
      throw new ServerError(
        "Você não pode aprovar ou negar um participante que já confirmou presença.",
        400
      );
    }

    // Update the participant's approval status
    await approveParticipant(activityId, participantId, approved);

    // Grant the "Dando boas-vindas" achievement if this is the first approval
    if (approved) {
      const approvedParticipants = await getApprovedParticipantsByCreator(
        userId
      );

      if (approvedParticipants.length === 0) {
        await grantAchievement("Dando boas-vindas", userId, 50);
      }
    }

    // Update the participant's approval status
    return await approveParticipant(activityId, participantId, approved);
  },

  // Check-in for an activity
  async checkInActivity(
    userId: string,
    activityId: string,
    confirmationCode: string
  ) {
    // Check if the activity exists
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }

    // Check if the activity is available (not deleted or completed)
    if (activity.deletedAt || activity.completedAt) {
      throw new ServerError(
        "Você não pode fazer check-in em uma atividade que foi desativada ou completada.",
        400
      );
    }

    // Check if the user is the creator of the activity
    if (activity.creatorId === userId) {
      throw new ServerError(
        "Você não pode fazer check-in na sua própria atividade.",
        400
      );
    }

    // Check if the user is already registered for the activity
    const existingParticipant = await checkExistingParticipant(
      userId,
      activityId
    );
    if (!existingParticipant) {
      throw new ServerError("Você não está inscrito nesta atividade.", 400);
    }

    // Check if the user has already confirmed participation
    if (existingParticipant.confirmedAt) {
      throw new ServerError(
        "Você já confirmou sua participação nesta atividade.",
        400
      );
    }

    // Check if the activity is private and if the participant is approved
    if (activity.private && existingParticipant.approved == null) {
      throw new ServerError(
        "Sua inscrição ainda não foi aprovada pelo criador da atividade.",
        403
      );
    }

    // Check if the participant was explicitly denied by the creator
    if (existingParticipant.approved === false) {
      throw new ServerError(
        "Sua inscrição não foi aprovada pelo criador da atividade.",
        403
      );
    }

    // Check if the confirmation code matches
    if (activity.confirmationCode !== confirmationCode) {
      throw new ServerError("Código de confirmação inválido.", 400);
    }

    // Grant the "Primeiro Check-in" achievement
    await grantAchievement("Primeiro Check-in", userId, 100);

    // Grant the "Participante Frequente" achievement if the user has checked in to 5 activities
    const participantActivities = await getActivitiesByParticipant(userId);

    // Filter activities where the user has confirmed participation
    const confirmedActivities = participantActivities.filter((activity) =>
      activity.ActivityParticipant.some(
        (participant) =>
          participant.userId === userId && participant.confirmedAt !== null
      )
    );

    // Check if the user has checked-in to 5 activities
    if (confirmedActivities.length === 5) {
      await grantAchievement("Participante Frequente", userId, 300);
    }

    // Add XP to the user who is checking in
    await addXPAndCheckLevel(userId, 50); // Add 50 XP to the participant

    // Add XP to the creator of the activity
    await addXPAndCheckLevel(activity.creatorId, 30); // Add 30 XP to the creator

    // Confirm the participation
    return await checkInActivity(userId, activityId);
  },

  // Unsubscribe from an activity
  async unsubscribeFromActivity(userId: string, activityId: string) {
    // Check if the activity exists
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 404);
    }

    // Check if the user is already registered for the activity
    const existingParticipant = await checkExistingParticipant(
      userId,
      activityId
    );
    if (!existingParticipant) {
      throw new ServerError("Você não se inscreveu nesta atividade.", 400);
    }

    // Check if the user has already confirmed participation
    if (existingParticipant.confirmedAt) {
      throw new ServerError(
        "Você já confirmou sua presença (Check-in) nessa atividade. Não é possivel se desinscrever",
        400
      );
    }

    // Unsubscribe from the activity
    return await unsubscribeActivity(userId, activityId);
  },

  // Delete an activity
  async deleteActivity(userId: string, activityId: string) {
    // Check if the activity exists
    const activity = await getActivityById(activityId);
    if (!activity) {
      throw new ServerError("Atividade não encontrada.", 400);
    }

    // Check if the user is the creator of the activity
    if (activity.creatorId !== userId) {
      throw new ServerError(
        "Você não tem permissão para excluir esta atividade.",
        403
      );
    }

    // Delete the activity
    return await deleteActivity(activityId);
  },
};
