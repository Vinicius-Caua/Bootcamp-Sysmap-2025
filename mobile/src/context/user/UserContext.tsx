import React, {createContext, useEffect, useCallback} from 'react';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import useAppContext from '../../hooks/useAppContext';

interface UserContextData {
  userData: any;
  refreshUserData: () => Promise<void>;
}

// Context created to manage user data
export const UserContext = createContext<UserContextData>(
  {} as UserContextData,
);

// Provider component
export const UserProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {
    user: {userData, getUserData},
  } = useAppContext();

  // Function to refresh user data
  const refreshUserData = useCallback(async () => {
    try {
      if (getUserData) {
        await getUserData();
      }
    } catch (error) {}
  }, [getUserData]);

  // Effect to fetch user data when the component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        refreshUserData,
      }}>
      {children}
    </UserContext.Provider>
  );
};
