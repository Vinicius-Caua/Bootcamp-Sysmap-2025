import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.white,
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
  },
  gridContainer: {
    justifyContent: 'center',
    paddingVertical: 10,
    flexGrow: 1,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 35,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 103,
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
  headerContainer: {
    marginTop: 106,
    marginLeft: 21,
  },
  containerInsideHeader: {
    position: 'absolute',
    top: 70,
    left: 16,
    zIndex: 10,
  },
});

export default styles;
