import {useContext} from 'react';
import {UserContext} from '../context/user/UserContext';

export default function useUserContext() {
  return useContext(UserContext);
}
