import {Dimensions, StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  imageUserContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  imageUser: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  imageActivityContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    top: '35%',
    right: '12%',
    zIndex: 1,
  },
  userOverlay: {
    borderRadius: 100,
  },
  activityOverlay: {
    borderRadius: 10,
  },
  editBorder: {
    borderWidth: 5,
    borderColor: THEME.COLORS.emerald,
  },
  editText: {
    color: 'white',
    fontFamily: THEME.FONTS.DMSans.bold,
    fontSize: 16,
  },
  imageActivity: {
    width: Dimensions.get('window').width * 0.9,
    height: 200,
    borderRadius: 10,
  },
});

export default styles;
