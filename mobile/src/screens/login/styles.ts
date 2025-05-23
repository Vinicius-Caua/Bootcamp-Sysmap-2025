import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  background: {
    display: 'flex',
    backgroundColor: THEME.COLORS.white,
    width: '100%',
    height: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 'auto',
    marginTop: 98,
    alignItems: 'center',
  },
  header: {
    marginTop: 45,
    width: '100%',
    alignItems: 'flex-start',
  },
  form: {
    width: '90%',
    gap: 16,
  },
  logo: {
    width: 143,
    height: 65,
  },
  subTitle: {
    width: 256,
    height: 96,
    marginTop: 14,
  },
  footer: {
    marginTop: 64,
    gap: 32,
    marginBottom: 251,
  },
});

export default styles;
