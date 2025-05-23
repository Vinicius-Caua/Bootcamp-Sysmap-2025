import {AuthTypeState} from '../../interfaces/auth/AuthInterface';
import {ActivitiesState} from '../../interfaces/activities/ActivitiesInterface';
import {UserState} from '../../interfaces/user/UserDataInterface';
import {
  Activity,
  ParticipantsActivity,
} from '../../models/activities/activitiesModel';

export interface AppState {
  auth: AuthTypeState;
  user: UserState;
  activities: ActivitiesState;
}

export const initialState: AppState = {
  auth: {
    token: '',
    isAuthenticated: null,
    login: (_email: string, _password: string) => {},
    logout: () => {},
    refreshToken: (_token: string) => {},
    isLoading: false,
    user: null,
    register: (
      _name: string,
      _email: string,
      _cpf: string,
      _password: string,
    ) => {},
  },
  user: {
    userData: {
      id: '',
      name: '',
      email: '',
      cpf: '',
      avatar: '',
      xp: 0,
      level: 0,
      achievements: [
        {
          name: '',
          criterion: '',
        },
      ],
    },
    userPreferences: {
      typeId: '',
      typeName: '',
      typeDescription: '',
    },
    setUserPreferences: async () => [],
    getUserData: async () => ({}),
    getUserPreferences: async () => [],
    updateUserAvatar: async () => ({}),
  },
  activities: {
    activityTypes: [],
    paginatedActivities: undefined,
    selectedActivity: undefined,
    getActivityTypes: async () => [],
    getActivitiesPaginated: async () => ({
      page: 0,
      pageSize: 0,
      totalActivities: 0,
      totalPages: 0,
      previous: null,
      next: null,
      activities: [],
    }),
    setSelectedActivity: _activity => {},
    getUserActivitiesByType: async () => ({
      page: 0,
      pageSize: 0,
      totalActivities: 0,
      totalPages: 0,
      previous: null,
      next: null,
      activities: [],
    }),
    getUserCreatedActivities: async (_page?: number, _pageSize?: number) => ({
      page: 0,
      pageSize: 0,
      totalActivities: 0,
      totalPages: 0,
      previous: null,
      next: null,
      activities: [],
    }),
    getUserParticipatedActivities: async (
      _page?: number,
      _pageSize?: number,
    ) => ({
      page: 0,
      pageSize: 0,
      totalActivities: 0,
      totalPages: 0,
      previous: null,
      next: null,
      activities: [],
    }),
    createActivity: async () => ({} as Activity),
    updateActivity: async () => ({} as Activity),
    getActivityParticipants: async () => [] as ParticipantsActivity[],
    cancelActivity: async () => ({} as Activity),
    acceptOrRejectParticipant: async () => ({} as any),
    subscribeToActivity: async () => ({} as any),
    unsubscribeFromActivity: async () => ({} as any),
    concludeActivity: async () => ({} as any),
    checkInActivity: async () => ({} as any),
  },
};
