import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  ellipse01: {
    position: 'absolute',
  },
  ellipse02: {
    position: 'absolute',
  },
  containerHeader: {
    backgroundColor: THEME.COLORS.white,
  },
  containerInsideHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    marginBottom: 22.72,
    paddingHorizontal: 28,
  },
  saudationGroup: {
    alignItems: 'flex-start',
  },
  userGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: THEME.FONTS.DMSans.medium,
    color: THEME.COLORS.white,
  },
  title: {
    fontSize: 30,
    fontFamily: THEME.FONTS.DMSans.medium,
    color: THEME.COLORS.white,
  },
  starContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.COLORS.white,
    borderRadius: 5,
    width: 52,
    height: 33,
  },
  star: {
    width: 16,
    height: 15.22,
  },
  starText: {
    color: THEME.COLORS.white,
    fontSize: 14,
    marginLeft: 6,
    fontFamily: THEME.FONTS.Bebas.regular,
  },
  containerBody: {
    backgroundColor: THEME.COLORS.white,
    width: '100%',
    marginBottom: 137,
  },
  recommendationsWrapper: {
    marginTop: 53,
  },
  scroll: {
    backgroundColor: THEME.COLORS.white,
  },
  footerBar: {
    position: 'absolute',
    bottom: 23,
    right: 30,
    zIndex: 999,
  },
  activitiesGridsContainer: {
    marginTop: 24,
  },
  activityTypes: {
    marginLeft: 25,
  },
});

export default styles;
