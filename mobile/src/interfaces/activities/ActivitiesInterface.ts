import {
  Activity,
  ActivityType,
  PaginatedActivities,
  ParticipantsActivity,
} from '../../models/activities/activitiesModel';

export interface ActivitiesState {
  activityTypes?: ActivityType[];
  paginatedActivities?: PaginatedActivities;
  selectedActivity?: Activity;
  getActivityTypes: () => Promise<ActivityType[]>;
  getActivitiesPaginated: (
    page?: number,
    pageSize?: number,
    typeId?: string,
    orderBy?: string,
    order?: string,
  ) => Promise<PaginatedActivities>;
  setSelectedActivity: (activity: Activity) => void;
  getUserActivitiesByType: (
    page: number,
    pageSize: number,
    typeId?: string,
  ) => Promise<PaginatedActivities>;
  getUserCreatedActivities: (
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedActivities>;
  getUserParticipatedActivities: (
    page?: number,
    pageSize?: number,
  ) => Promise<PaginatedActivities>;
  createActivity: (
    title: string,
    description: string,
    typeId: string,
    address: string,
    image: string,
    scheduledDate: string,
    isPrivate: boolean,
  ) => Promise<Activity>;
  getActivityParticipants: (
    activityId: string,
  ) => Promise<ParticipantsActivity[]>;
  updateActivity: (
    activityId: string,
    title: string,
    description: string,
    typeId: string,
    address: string,
    image: string,
    scheduledDate: string,
    isPrivate: boolean,
  ) => Promise<Activity>;
  cancelActivity: (activityId: string) => Promise<Activity>;
  acceptOrRejectParticipant: (
    activityId: string,
    participantId: string,
    approved: boolean,
  ) => Promise<any>;
  subscribeToActivity: (activityId: string) => Promise<{
    id: string;
    subscriptionStatus: string;
    confirmedAt: Date | null;
    activityId: string;
    userId: string;
  }>;
  unsubscribeFromActivity: (activityId: string) => Promise<void>;
  concludeActivity: (activityId: string) => Promise<any>;
  checkInActivity: (
    activityId: string,
    confirmationCode: string,
  ) => Promise<any>;
}
