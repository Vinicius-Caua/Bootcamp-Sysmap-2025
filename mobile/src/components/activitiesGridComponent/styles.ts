import {Dimensions, StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const windowWidth = Dimensions.get('window').width;
const CARD_SPACING = 20;
const SLIDE_WIDTH = windowWidth - CARD_SPACING * 2;
const SLIDE_GAP = 30;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: THEME.COLORS.white,
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: THEME.FONTS.Bebas.regular,
  },
  text: {
    fontSize: 15,
    fontFamily: THEME.FONTS.Bebas.regular,
  },
  gridContainer: {
    paddingLeft: CARD_SPACING,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  activityItem: {
    marginBottom: 20,
    width: 354,
    height: 'auto',
  },
  buttonText: {
    fontFamily: THEME.FONTS.Bebas.regular,
    fontSize: 15,
  },
  activityColumn: {
    width: SLIDE_WIDTH,
    marginRight: SLIDE_GAP,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: THEME.COLORS.gray,
  },
  loadMoreIndicator: {
    marginVertical: 20,
  },
});

export default styles;
