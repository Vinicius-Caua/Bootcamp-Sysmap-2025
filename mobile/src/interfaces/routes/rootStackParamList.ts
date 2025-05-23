import {Activity} from '../../models/activities/activitiesModel';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ActivitiesType: {
    typeId: string;
    typeName: string;
  };
  UserProfile: undefined;
  UserEditProfile: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    avatar: string;
    xp: number;
    level: number;
    achievements: {name: string; criterion: string}[];
  };
  GeneralActivityScreenCreator: {activityId: string};
  GeneralActivityScreenUser: {activityId: string};
  ConfirmationCodeView: {activityId: string; statusScheduledData: string};
  ConcludedActivityView: {
    activityId: string;
    activity: Activity;
  };
  CheckIngActivityUser: {activityId: string};
};
