import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  background: {
    display: 'flex',
    backgroundColor: THEME.COLORS.white,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 'auto',
    marginTop: 23,
    alignItems: 'flex-start',
  },
  header: {
    display: 'flex',
    backgroundColor: THEME.COLORS.emerald,
    width: '100%',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  statusbarArea: {
    backgroundColor: THEME.COLORS.emerald,
    width: '100%',
    height: 40,
  },
  chieldrenView: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
});

export default styles;
