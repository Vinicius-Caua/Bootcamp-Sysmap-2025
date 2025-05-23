export interface UserState {
  userData: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    avatar: string;
    xp: number;
    level: number;
    achievements: [
      {
        name: string;
        criterion: string;
      },
    ];
  };
  userPreferences: {
    typeId: string;
    typeName: string;
    typeDescription: string;
  };
  setUserPreferences?: (typeIds: string[]) => Promise<any>;
  getUserData?: () => Promise<any>;
  getUserPreferences?: () => Promise<any>;
  updateUserAvatar?: (avatarUri: string) => Promise<any>;
  updateUserData?: (userEditData: {
    name?: string;
    email?: string;
    password?: string;
  }) => Promise<any>;
  deactivateUserAccount?: () => Promise<any>;
}
