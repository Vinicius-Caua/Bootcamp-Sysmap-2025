import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: THEME.COLORS.gray,
    fontFamily: THEME.FONTS.DMSans.regular,
  },
  boldText: {
    fontFamily: THEME.FONTS.DMSans.bold,
  },
});

export default styles;
