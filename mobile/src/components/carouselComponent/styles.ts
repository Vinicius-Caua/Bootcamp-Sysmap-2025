import {Dimensions, StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

export const stylesProfileStatusBox = StyleSheet.create({
  container: {
    width: '90%',
    height: 225,
    backgroundColor: THEME.COLORS.mediumGrayTransparent,
    borderRadius: 30,
  },
  textLevel: {
    fontSize: 12,
    fontFamily: THEME.FONTS.DMSans.semiBold,
  },
  numberLevel: {
    fontSize: 25,
    paddingLeft: 2,
    fontFamily: THEME.FONTS.DMSans.bold,
  },
  levelContainer: {
    gap: 13,
    paddingHorizontal: 35,
  },
  trophies: {
    width: 153,
    height: 92,
  },
  iconContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    marginTop: 22,
    marginBottom: 15,
  },
  levelBarText: {
    fontSize: 10,
    fontFamily: THEME.FONTS.DMSans.medium,
  },
  ptsText: {
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.regular,
  },
  icon: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 7,
  },
  levelBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  bar: {
    width: 310,
    height: 4,
    backgroundColor: THEME.COLORS.mediumGrayTransparent,
    borderRadius: 4,
    marginTop: 8,
    marginHorizontal: 30,
  },
  barStatus: {
    height: '100%',
    backgroundColor: THEME.COLORS.black,
    borderRadius: 4,
  },
});

export const stylesRenderMedalCard = StyleSheet.create({
  renderMedalCardContainer: {
    width: 120,
    height: '100%',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  medalIconContainer: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalIcon: {
    width: 65,
    height: 90,
  },
  medalCriterionText: {
    fontSize: 12,
    fontFamily: THEME.FONTS.DMSans.regular,
    textAlign: 'center',
    marginTop: 13,
    marginRight: 10,
  },
});

export const stylesMedalBox = StyleSheet.create({
  container: {
    width: '90%',
    height: 225,
    backgroundColor: THEME.COLORS.mediumGrayTransparent,
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  renderItemContainer: {
    height: 230,
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 35,
    paddingLeft: 10,
  },
  mapRenderItem: {
    paddingHorizontal: 10,
  },
  textMedalBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 230,
  },
  textMedalBox: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});

export const stylesCarousel = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  flatListContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
