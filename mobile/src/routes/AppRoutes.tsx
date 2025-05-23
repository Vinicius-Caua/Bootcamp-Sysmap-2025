import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/login/Login';
import RegisterScreen from '../screens/register/Register';
import HomeScreen from '../screens/home/Home';
import {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import useAppContext from '../hooks/useAppContext';
import styles from './styles';
import ActivitiesTypeScreen from '../screens/activitiesType/ActivitiesType';
import {RootStackParamList} from '../interfaces/routes/rootStackParamList';
import UserProfileScreen from '../screens/userProfile/UserProfile';
import UserEditProfileScreen from '../screens/userEditProfile/UserEditProfile';
import GeneralActivityScreenCreator from '../screens/ActivitiesViews/CreatorViewsScreens/generalActivityCreator/GeneralActivityCreator';
import GeneralActivityScreenUser from '../screens/ActivitiesViews/UserViewsScreens/generalActivityUser/GeneralActivityUser';
import {PersonSimpleRun} from 'phosphor-react-native';
import THEME from '../assets/themes/THEME';
import ConfirmationCodeViewScreen from '../screens/ActivitiesViews/CreatorViewsScreens/confirmationCodeView/ConfirmationCodeView';
import ConcludedActivityViewScreen from '../screens/ActivitiesViews/BothViewsScreens/concludedActivityView/ConcludedActivityView';
import CheckIngActivityUserScreen from '../screens/ActivitiesViews/UserViewsScreens/checkInActivityUser/CheckIngActivityUser';
// Private routes
// This is the main stack of the app, where the user will be redirected after succesfully login
const PrivateStack = createStackNavigator<RootStackParamList>();

function MainStackScreen() {
  return (
    <PrivateStack.Navigator>
      <PrivateStack.Group
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          gestureVelocityImpact: 0,
        }}>
        <PrivateStack.Screen name="Home" component={HomeScreen} />
        <PrivateStack.Screen
          name="ActivitiesType"
          component={ActivitiesTypeScreen}
        />
        <PrivateStack.Screen name="UserProfile" component={UserProfileScreen} />
        <PrivateStack.Screen
          name="UserEditProfile"
          component={UserEditProfileScreen}
        />
        <PrivateStack.Screen
          name="GeneralActivityScreenCreator"
          component={GeneralActivityScreenCreator}
        />
        <PrivateStack.Screen
          name="GeneralActivityScreenUser"
          component={GeneralActivityScreenUser}
        />
        <PrivateStack.Screen
          name="ConfirmationCodeView"
          component={ConfirmationCodeViewScreen}
        />
        <PrivateStack.Screen
          name="ConcludedActivityView"
          component={ConcludedActivityViewScreen}
        />
        <PrivateStack.Screen
          name="CheckIngActivityUser"
          component={CheckIngActivityUserScreen}
        />
      </PrivateStack.Group>
    </PrivateStack.Navigator>
  );
}

// Public routes
const PublicStack = createStackNavigator<RootStackParamList>();

function LoginStackScreen() {
  return (
    <PublicStack.Navigator initialRouteName="Login">
      <PublicStack.Group
        screenOptions={{
          headerShown: false,
        }}>
        <PublicStack.Screen name="Login" component={LoginScreen} />
        <PrivateStack.Screen name="Register" component={RegisterScreen} />
      </PublicStack.Group>
    </PublicStack.Navigator>
  );
}

export default function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    auth: {isAuthenticated},
  } = useAppContext();

  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return isLoading ? (
    <View style={styles.isLoadingSplash}>
      <View style={styles.iconContainer}>
        <PersonSimpleRun size={50} color={THEME.COLORS.emerald} weight="bold" />
      </View>
      <ActivityIndicator size="large" color={THEME.COLORS.white} />
    </View>
  ) : (
    <NavigationContainer>
      {isAuthenticated ? <MainStackScreen /> : <LoginStackScreen />}
    </NavigationContainer>
  );
}
