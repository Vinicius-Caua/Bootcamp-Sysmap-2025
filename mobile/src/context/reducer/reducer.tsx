import {AppState} from '../state/state';

export enum ActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FETCH_USER_DATA = 'FETCH_USER_DATA',
  FETCH_USER_PREFERENCES = 'FETCH_USER_PREFERENCES',
  FETCH_ACTIVITY_TYPES = 'FETCH_ACTIVITY_TYPES',
  FETCH_PAGINATED_ACTIVITIES = 'FETCH_PAGINATED_ACTIVITIES',
  SET_SELECTED_ACTIVITY = 'SET_SELECTED_ACTIVITY',
  SET_USER_PREFERENCES = 'SET_USER_PREFERENCES',
  ADD_ACTIVITY = 'ADD_ACTIVITY',
  UPDATE_ACTIVITY = 'UPDATE_ACTIVITY',
}

interface Action {
  type: ActionTypes;
  payload?: any;
}

export const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.payload.token,
          isAuthenticated: true,
          user: action.payload.user,
        },
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        auth: {
          ...state.auth,
          token: '',
          isAuthenticated: false,
          user: null,
        },
      };
    case ActionTypes.FETCH_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          userData: action.payload,
        },
      };
    case ActionTypes.FETCH_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          userPreferences: action.payload,
        },
      };
    case ActionTypes.SET_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          userPreferences: action.payload,
        },
      };
    case ActionTypes.FETCH_ACTIVITY_TYPES:
      return {
        ...state,
        activities: {
          ...state.activities,
          activityTypes: action.payload,
        },
      };
    case ActionTypes.FETCH_PAGINATED_ACTIVITIES:
      return {
        ...state,
        activities: {
          ...state.activities,
          paginatedActivities: action.payload,
        },
      };
    case ActionTypes.SET_SELECTED_ACTIVITY:
      return {
        ...state,
        activities: {
          ...state.activities,
          selectedActivity: action.payload,
        },
      };
    case ActionTypes.ADD_ACTIVITY:
      return {
        ...state,
        activities: {
          ...state.activities,
          paginatedActivities: state.activities.paginatedActivities
            ? {
                ...state.activities.paginatedActivities,
                activities: [
                  action.payload,
                  ...state.activities.paginatedActivities.activities,
                ],
              }
            : undefined,
        },
      };
    case ActionTypes.UPDATE_ACTIVITY:
      return {
        ...state,
        activities: {
          ...state.activities,
          selectedActivity:
            state.activities.selectedActivity?.id === action.payload.id
              ? action.payload
              : state.activities.selectedActivity,
          paginatedActivities: state.activities.paginatedActivities
            ? {
                ...state.activities.paginatedActivities,
                activities: state.activities.paginatedActivities.activities.map(
                  activity =>
                    activity.id === action.payload.id
                      ? action.payload
                      : activity,
                ),
              }
            : undefined,
        },
      };
    default:
      return state;
  }
};
