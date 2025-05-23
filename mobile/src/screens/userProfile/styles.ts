import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  containerInsideHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 53,
    gap: 80,
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
  containerRightButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 17,
  },
  title: {
    textAlign: 'center',
    paddingLeft: 50,
    fontSize: 32,
  },
  scrollContainer: {
    backgroundColor: THEME.COLORS.white,
  },
  containerUserPhoto: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
    gap: 23,
  },
  userName: {
    fontSize: 28,
  },
  profileStatusBoxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
    marginBottom: 31,
  },
  userPhotoProfile: {
    width: 104,
    height: 104,
    borderRadius: 100,
  },
  activitiesGridsContainer: {
    marginBottom: 47,
    gap: 14,
  },
});

export default styles;
