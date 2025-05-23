import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  containerInsideHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 68,
    marginLeft: 41,
    gap: 71,
  },
  backButtonHitContainer: {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    paddingRight: 128,
  },
  scrollContainer: {
    backgroundColor: THEME.COLORS.white,
  },
  cameraIcon: {
    width: 47,
    height: 35,
  },
  containerImagePicker: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 82,
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    width: '90%',
    gap: 16,
  },
  containerActivityTypes: {
    marginTop: 42,
    marginBottom: 55,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 59,
  },
  activityTypes: {
    marginLeft: 38,
  },
  deactivateButton: {
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.bold,
  },
});

export default styles;
