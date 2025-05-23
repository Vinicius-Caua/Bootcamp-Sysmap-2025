import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  label: {
    fontFamily: THEME.FONTS.DMSans.semiBold,
    fontSize: 16,
    color: THEME.COLORS.gray,
    lineHeight: 20,
  },
  required: {
    color: THEME.COLORS.red,
  },
  input: {
    marginTop: 6,
    width: '100%',
    height: 56,
    justifyContent: 'center',
    fontFamily: THEME.FONTS.DMSans.regular,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: THEME.COLORS.lightGray,
    borderRadius: 8,
    color: THEME.COLORS.gray,
    paddingLeft: 20,
  },
  error: {
    color: THEME.COLORS.red,
  },
});

export default styles;
