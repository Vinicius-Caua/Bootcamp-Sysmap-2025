import {StyleSheet} from 'react-native';
import THEME from '../assets/themes/THEME';

const styles = StyleSheet.create({
  isLoadingSplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.COLORS.emerald,
  },
  iconContainer: {
    backgroundColor: THEME.COLORS.white,
    borderRadius: 30,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default styles;
