import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 32,
    fontFamily: THEME.FONTS.Bebas.regular,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.regular,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  buttonConfirm: {
    width: '40%',
  },
  buttonCancel: {
    width: '40%',
  },
});

export default styles;
