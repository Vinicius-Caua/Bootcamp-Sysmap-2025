import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.white,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 48,
    paddingHorizontal: 20,
  },
  activitiesGridsContainer: {
    marginTop: 18,
    gap: 27,
  },
  backButtonHitContainer: {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
  },
  backButton: {
    marginTop: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 50,
  },
  activityTypesContainer: {
    marginTop: 24,
  },
  activityTypes: {
    marginLeft: 25,
  },
});

export default styles;
