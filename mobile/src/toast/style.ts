import {StyleSheet} from 'react-native';
import THEME from '../assets/themes/THEME';

const styles = StyleSheet.create({
  baseToastSucess: {
    borderLeftColor: THEME.COLORS.emerald,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sucessText1: {
    fontSize: 20,
    fontFamily: THEME.FONTS.Bebas.regular,
    fontWeight: '400',
  },
  sucessText2: {
    fontSize: 13,
    fontFamily: THEME.FONTS.DMSans.regular,
    fontWeight: '400',
  },
  baseToastError: {
    borderLeftColor: THEME.COLORS.red,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText1: {
    fontSize: 20,
    fontFamily: THEME.FONTS.Bebas.regular,
    fontWeight: '400',
  },
  errorText2: {
    fontSize: 13,
    fontFamily: THEME.FONTS.Bebas.regular,
    fontWeight: '400',
  },
  baseToastInfo: {
    borderLeftColor: THEME.COLORS.blue,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText1: {
    fontSize: 20,
    fontFamily: THEME.FONTS.Bebas.regular,
    fontWeight: '400',
  },
  infoText2: {
    fontSize: 13,
    fontFamily: THEME.FONTS.Bebas.regular,
    fontWeight: '400',
  },
});

export default styles;
