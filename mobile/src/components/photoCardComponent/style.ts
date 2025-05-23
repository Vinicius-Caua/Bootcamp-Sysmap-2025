import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  smallImage: {
    borderRadius: 100,
    width: 58,
    height: 58,
  },
  bigImage: {
    borderRadius: 100,
    width: 120,
    height: 120,
    marginBottom:  23,
  },
  touchable: {
    alignItems: 'center',
  },
  selectedImage: {
    borderWidth: 4,
    borderRadius: 100,
    borderColor: THEME.COLORS.emerald,
  },
  text: {
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.semiBold,
    color: THEME.COLORS.black,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
});

export default styles;
