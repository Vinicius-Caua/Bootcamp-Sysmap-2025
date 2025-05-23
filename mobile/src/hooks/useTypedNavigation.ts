import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../interfaces/routes/rootStackParamList';

export const useTypedNavigation = () => {
  return useNavigation<StackNavigationProp<RootStackParamList>>();
};
