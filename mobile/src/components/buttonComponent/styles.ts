import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  // Base Styles button
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },

  // Button Variants
  default: {
    backgroundColor: THEME.COLORS.emerald,
    borderRadius: 4,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.COLORS.emerald,
    borderRadius: 4,
  },
  danger: {
    backgroundColor: THEME.COLORS.red,
    borderRadius: 4,
  },
  dark: {
    backgroundColor: THEME.COLORS.black,
    borderRadius: 4,
  },
  secundary: {
    backgroundColor: THEME.COLORS.mediumGrayTransparent,
    borderRadius: 4,
  },

  // Button Sizes
  normal: {
    width: 321,
    height: 44,
  },
  circle: {
    borderRadius: 50,
    width: 60,
    height: 60,
  },

  // Button Text
  text: {
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.bold,
  },
  defaultText: {
    color: THEME.COLORS.white,
  },
  ghostText: {
    color: THEME.COLORS.black,
  },
  outlineText: {
    color: THEME.COLORS.emerald,
  },
  dangerText: {
    color: THEME.COLORS.white,
  },
  darkText: {
    color: THEME.COLORS.white,
  },
  secundaryText: {
    color: THEME.COLORS.lightBlack,
  },

  // Disabled State
  disabled: {
    opacity: 0.6,
  },

  // Icon Styles
  icon: {
    marginRight: 8,
  },
  circleIcon: {
    marginRight: 0,
  },
});

export default styles;
