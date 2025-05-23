import React from 'react';
import AppRoutes from './src/routes/AppRoutes';
import Toast from 'react-native-toast-message';
import {AppStateProvider} from './src/context/AppState';
import {toastConfig} from './src/toast/Toast';
import {UserProvider} from './src/context/user/UserContext';

function App() {
  return (
    <>
      <AppStateProvider>
        <UserProvider>
          <AppRoutes />
          <Toast config={toastConfig} autoHide={true} visibilityTime={2000} />
        </UserProvider>
      </AppStateProvider>
    </>
  );
}

export default App;
