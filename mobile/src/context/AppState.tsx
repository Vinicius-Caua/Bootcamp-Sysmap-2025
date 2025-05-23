import {
  createContext,
  ReactNode,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import Keychain from 'react-native-keychain';
import {AppState, initialState} from './state/state';
import {reducer, ActionTypes} from './reducer/reducer';
import api, {getHeaders} from '../api/api';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {userType} from '../models/user/userModel';
import {Activity} from '../models/activities/activitiesModel';

export const AppContext = createContext<AppState>(initialState);

interface AppStateProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = 'com.reactexample.token';
const USER_STORAGE_KEY = 'com.reactexample.user';

export function AppStateProvider({children}: AppStateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        if (!Keychain || typeof Keychain.getGenericPassword !== 'function') {
          console.error('Keychain module not properly initialized');
          dispatch({type: ActionTypes.LOGOUT, payload: null});
          return;
        }
        const token = await Keychain.getGenericPassword({
          service: TOKEN_STORAGE_KEY,
        });
        const user = await Keychain.getGenericPassword({
          service: USER_STORAGE_KEY,
        });

        if (token && user) {
          dispatch({
            type: ActionTypes.LOGIN,
            payload: {token: token.password, user: JSON.parse(user.password)},
          });
        } else {
          dispatch({type: ActionTypes.LOGOUT, payload: null});
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro no login',
          text2: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    };

    load();
  }, []);

  async function storageAuthData(token: string, user: any) {
    await Keychain.setGenericPassword('token', token, {
      service: TOKEN_STORAGE_KEY,
    });
    await Keychain.setGenericPassword('user', JSON.stringify(user), {
      service: USER_STORAGE_KEY,
    });
  }

  async function removeAuthData() {
    await Keychain.resetGenericPassword({service: TOKEN_STORAGE_KEY});
    await Keychain.resetGenericPassword({service: USER_STORAGE_KEY});
  }

  // Functions handler to use API routes
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = {
        email,
        password,
      };

      const response = await api.post('/auth/sign-in', JSON.stringify(data), {
        headers: getHeaders(),
      });

      const responseData: any = response.data;

      const user = userType(responseData);

      await storageAuthData(responseData.token, user);
      dispatch({
        type: ActionTypes.LOGIN,
        payload: {token: responseData.token, user},
      });

      Toast.show({
        type: 'success',
        text1: 'Login realizado com sucesso',
        text2: `Bem-vindo, ${user.name}!`,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro no login',
        text2: error.response.data.error,
      });

      throw error;
    }
  }, []);

  // Logout function to remove token and user data from storage
  const logout = useCallback(async () => {
    try {
      Toast.show({
        type: 'success',
        text1: 'Logout realizado com sucesso',
        text2: 'Você foi desconectado da sessão.',
      });
      await removeAuthData();
      dispatch({type: ActionTypes.LOGOUT});
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no login',
        text2: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }, []);

  // Register function to create a new user
  const register = useCallback(
    async (name: string, email: string, cpf: string, password: string) => {
      try {
        const data = {
          name,
          email,
          cpf,
          password,
        };

        const response = await api.post('/auth/register', data, {
          headers: getHeaders(),
        });

        const responseData: any = response.data;

        Toast.show({
          type: 'success',
          text1: 'Cadastro realizado com sucesso',
          text2: responseData.message,
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao cadastro',
          text2: error.response.data.error,
        });

        throw error;
      }
    },
    [],
  );

  // Function get user data from the API
  const getUserData = useCallback(async () => {
    try {
      const response = await api.get('/user', {
        headers: getHeaders(state.auth.token),
      });

      const responseData: any = response.data;
      const user = userType(responseData);

      dispatch({
        type: ActionTypes.FETCH_USER_DATA,
        payload: user,
      });

      return user;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao pegar os dados do usuário',
        text2: error.response.data.error,
      });

      throw error;
    }
  }, [state.auth.token]);

  // Function to get user preferences from the API
  const getUserPreferences = useCallback(async () => {
    try {
      const response = await api.get('/user/preferences', {
        headers: getHeaders(state.auth.token),
      });

      const responseData: any = response.data;

      dispatch({
        type: ActionTypes.FETCH_USER_PREFERENCES,
        payload: responseData,
      });

      return responseData;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao pegar as preferências do usuário',
        text2: error.response.data.error,
      });

      throw error;
    }
  }, [state.auth.token]);

  // Function to set user preferences in the API
  const setUserPreferences = useCallback(
    async (typeIds: string[]) => {
      try {
        const response = await api.post('/user/preferences/define', typeIds, {
          headers: getHeaders(state.auth.token),
        });

        const responseData: any = response.data;

        dispatch({
          type: ActionTypes.FETCH_USER_PREFERENCES,
          payload: responseData,
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao definir as preferências do usuário',
          text2: error.response.data.error,
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to get activity types from the API
  const getActivityTypes = useCallback(async () => {
    try {
      if (state.activities.activityTypes?.length > 0) {
        return state.activities.activityTypes;
      }

      const response = await api.get('/activities/types', {
        headers: getHeaders(state.auth.token),
      });

      const responseData = response.data;

      dispatch({
        type: ActionTypes.FETCH_ACTIVITY_TYPES,
        payload: responseData,
      });

      return responseData;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao pegar os tipos de atividades',
        text2: error.response.data.error,
      });

      throw error;
    }
  }, [state.activities.activityTypes, state.auth.token]);

  // Function to get activities from the API
  const getActivitiesPaginated = useCallback(
    async (
      page: number = 1,
      pageSize: number = 10,
      typeId?: string,
      orderBy?: string,
      order: string = 'desc',
    ) => {
      try {
        const params: any = {page, pageSize};
        if (typeId) {
          params.typeId = typeId;
        }
        if (orderBy) {
          params.orderBy = orderBy;
          params.order = order;
        }

        const response = await api.get('/activities', {
          headers: getHeaders(state.auth.token),
          params: params,
        });

        const responseData = response.data;

        dispatch({
          type: ActionTypes.FETCH_PAGINATED_ACTIVITIES,
          payload: responseData,
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao buscar atividades',
          text2: error.response.data.error,
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  const setSelectedActivity = useCallback((activity: Activity) => {
    dispatch({
      type: ActionTypes.SET_SELECTED_ACTIVITY,
      payload: activity,
    });
  }, []);

  const getUserActivitiesByType = useCallback(
    async (page: number, pageSize: number, typeId?: string) => {
      try {
        // Buscar atividades já filtradas pelo typeId
        const response = await getActivitiesPaginated(page, pageSize, typeId);

        // Filtrar apenas as atividades criadas pelo usuário logado
        const userActivities = response.activities.filter(
          (activity: {creator: {id: string}}) =>
            activity.creator && activity.creator.id === state.auth.user?.id,
        );

        // Retornar com a estrutura correta
        return {
          ...response,
          activities: userActivities,
          totalActivities: userActivities.length,
          totalPages: Math.ceil(userActivities.length / pageSize) || 1,
        };
      } catch (error) {
        console.error('Erro ao filtrar atividades do usuário:', error);
        return {
          page: page,
          pageSize: pageSize,
          totalActivities: 0,
          totalPages: 0,
          previous: null,
          next: null,
          activities: [],
        };
      }
    },
    [getActivitiesPaginated, state.auth.user?.id],
  );
  // Function to get user creator activities from the API
  const getUserCreatedActivities = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        const params = {page, pageSize};

        const response = await api.get('/activities/user/creator', {
          headers: getHeaders(state.auth.token),
          params,
        });

        const responseData = response.data;
        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao buscar suas atividades',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to get user activities participated from the API
  const getUserParticipatedActivities = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        const params = {page, pageSize};

        const response = await api.get('/activities/user/participant', {
          headers: getHeaders(state.auth.token),
          params,
        });

        const responseData = response.data;
        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao buscar suas atividades',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to get participants of an activity by activity ID
  const getActivityParticipants = useCallback(
    async (activityId: string) => {
      try {
        const response = await api.get(
          `/activities/${activityId}/participants`,
          {
            headers: getHeaders(state.auth.token),
          },
        );

        const responseData = response.data;
        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao buscar participantes da atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to create a new activity
  const createActivity = useCallback(
    async (
      title: string,
      description: string,
      typeId: string,
      address: string,
      image: string,
      scheduledDate: string,
      isPrivate: boolean,
    ) => {
      try {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('typeId', typeId);
        formData.append('address', address);
        formData.append('scheduledDate', scheduledDate);
        formData.append('private', isPrivate ? 'true' : 'false');

        // Clean up the URI to ensure it's in the correct format
        const uriParts = image.split('/');
        const fileName = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: fileName,
        } as any);

        const response = await api.post('/activities/new', formData, {
          headers: {
            ...getHeaders(state.auth.token),
            'Content-Type': 'multipart/form-data',
          },
        });

        const responseData = response.data;

        // Update the activities state in the context
        dispatch({
          type: ActionTypes.ADD_ACTIVITY,
          payload: responseData,
        });

        Toast.show({
          type: 'success',
          text1: 'Atividade criada com sucesso',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to Update activity by ID
  const updateActivity = useCallback(
    async (
      activityId: string,
      title: string,
      description: string,
      typeId: string,
      address: string,
      image: string,
      scheduledDate: string,
      isPrivate: boolean,
    ) => {
      try {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('typeId', typeId);
        formData.append('address', address);
        formData.append('scheduledDate', scheduledDate);
        formData.append('private', isPrivate ? 'true' : 'false');

        // Handle image only if it has changed (starts with file://)
        if (image.startsWith('file://')) {
          // Clean up the URI to ensure it's in the correct format
          const uriParts = image.split('/');
          const fileName = uriParts[uriParts.length - 1];

          formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: fileName,
          } as any);
        }

        const response = await api.put(
          `/activities/${activityId}/update`,
          formData,
          {
            headers: {
              ...getHeaders(state.auth.token),
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        const responseData = response.data;

        // Update the activities state in the context
        dispatch({
          type: ActionTypes.UPDATE_ACTIVITY,
          payload: responseData,
        });

        Toast.show({
          type: 'success',
          text1: 'Atividade atualizada com sucesso',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to cancel an activity by ID
  const cancelActivity = useCallback(
    async (activityId: string) => {
      try {
        const response = await api.delete(`/activities/${activityId}/delete`, {
          headers: getHeaders(state.auth.token),
        });

        const responseData = response.data;

        // Update the activities state in the context
        dispatch({
          type: ActionTypes.ADD_ACTIVITY,
          payload: responseData,
        });

        Toast.show({
          type: 'success',
          text1: 'Atividade cancelada com sucesso',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao cancelar atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to accept or reject a participant in an activity
  const acceptOrRejectParticipant = useCallback(
    async (activityId: string, participantId: string, approved: boolean) => {
      try {
        const data = {
          participantId: participantId,
          approved: approved,
        };

        const response = await api.put(
          `/activities/${activityId}/approve`,
          data,
          {
            headers: getHeaders(state.auth.token),
          },
        );

        const responseData = response.data;

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar participante',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to user subscribe to an activity
  const subscribeToActivity = useCallback(
    async (activityId: string) => {
      try {
        const response = await api.post(
          `/activities/${activityId}/subscribe`,
          {},
          {
            headers: getHeaders(state.auth.token),
          },
        );

        const responseData = response.data;

        Toast.show({
          type: 'success',
          text1: 'Inscrição realizada com sucesso',
          text2: 'Você se inscreveu na atividade com sucesso.',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao se inscrever na atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to unsubscribe from an activity
  const unsubscribeFromActivity = useCallback(
    async (activityId: string) => {
      try {
        const response = await api.delete(
          `/activities/${activityId}/unsubscribe`,
          {
            headers: getHeaders(state.auth.token),
          },
        );

        const responseData = response.data;

        Toast.show({
          type: 'success',
          text1: 'Desinscrição realizada com sucesso',
          text2: 'Você se desinscreveu da atividade com sucesso.',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao se desinscrever da atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to conclude an activity by ID
  const concludeActivity = useCallback(
    async (activityId: string) => {
      try {
        const response = await api.put(
          `/activities/${activityId}/conclude`,
          {}, // Corpo vazio
          {
            headers: getHeaders(state.auth.token), // Headers no lugar correto
          },
        );

        const responseData = response.data;

        // Update the activities state in the context
        dispatch({
          type: ActionTypes.UPDATE_ACTIVITY,
          payload: responseData,
        });

        Toast.show({
          type: 'success',
          text1: 'Atividade concluída com sucesso',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao concluir atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to check in to an activity
  const checkInActivity = useCallback(
    async (activityId: string, code: string) => {
      try {
        const response = await api.put(
          `/activities/${activityId}/check-in`,
          {confirmationCode: code},
          {
            headers: getHeaders(state.auth.token),
          },
        );

        const responseData = response.data;

        Toast.show({
          type: 'success',
          text1: 'Check-in realizado com sucesso',
          text2: 'Você fez check-in na atividade com sucesso.',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao fazer check-in na atividade',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to update user avatar
  const updateUserAvatar = useCallback(
    async (avatarUri: string) => {
      try {
        const formData = new FormData();

        // Clean up the URI to ensure it's in the correct format
        const uriParts = avatarUri.split('/');
        const fileName = uriParts[uriParts.length - 1];

        formData.append('avatar', {
          uri: avatarUri,
          type: 'image/jpeg',
          name: fileName,
        } as any);

        const response = await api.put('/user/avatar', formData, {
          headers: {
            ...getHeaders(state.auth.token),
            'Content-Type': 'multipart/form-data',
          },
        });

        const responseData: any = response.data;

        // Update the user data in the context
        dispatch({
          type: ActionTypes.FETCH_USER_DATA,
          payload: responseData,
        });

        Toast.show({
          type: 'success',
          text1: 'Avatar atualizado com sucesso',
          text2: 'Seu avatar foi atualizado com sucesso.',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar o avatar',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to update user data
  const updateUserData = useCallback(
    async (userEditData: any) => {
      try {
        const response = await api.put('/user/update', userEditData, {
          headers: getHeaders(state.auth.token),
        });

        const responseData: any = response.data;

        // Update the user data in the context
        dispatch({
          type: ActionTypes.FETCH_USER_DATA,
          payload: responseData,
        });

        Toast.show({
          type: 'success',
          text1: 'Dados atualizados com sucesso',
          text2: 'Seus dados foram atualizados com sucesso.',
        });

        return responseData;
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar os dados',
          text2: error.response?.data?.error || 'Erro desconhecido',
        });

        throw error;
      }
    },
    [state.auth.token],
  );

  // Function to deactivate user account
  const deactivateUserAccount = useCallback(async () => {
    try {
      const response = await api.delete('/user/deactivate', {
        headers: getHeaders(state.auth.token),
      });

      const responseData: any = response.data;

      // Clear user data from context
      dispatch({type: ActionTypes.LOGOUT});

      Toast.show({
        type: 'success',
        text1: 'Conta desativada com sucesso',
      });

      return responseData;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao desativar a conta',
        text2: error.response?.data?.error || 'Erro desconhecido',
      });

      throw error;
    }
  }, [state.auth.token]);

  return (
    <AppContext.Provider
      value={{
        auth: {
          ...state.auth,
          login,
          logout,
          register,
        },
        user: {
          ...state.user,
          userData: state.user.userData,
          getUserData,
          getUserPreferences,
          setUserPreferences,
          updateUserAvatar,
          updateUserData,
          deactivateUserAccount,
        },
        activities: {
          ...state.activities,
          getActivityTypes,
          getActivitiesPaginated,
          setSelectedActivity,
          getUserActivitiesByType,
          getUserCreatedActivities,
          getUserParticipatedActivities,
          createActivity,
          updateActivity,
          getActivityParticipants,
          cancelActivity,
          acceptOrRejectParticipant,
          subscribeToActivity,
          unsubscribeFromActivity,
          concludeActivity,
          checkInActivity,
        },
      }}>
      {children}
    </AppContext.Provider>
  );
}
