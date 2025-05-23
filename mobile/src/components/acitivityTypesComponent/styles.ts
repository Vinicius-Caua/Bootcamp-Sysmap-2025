import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    gap: 19,
  },
  flatList: {
    display: 'flex',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 196,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: THEME.FONTS.Bebas.regular,
  },
  typeList: {
    width: 102,
    alignItems: 'center',
  },
});

export default styles;
