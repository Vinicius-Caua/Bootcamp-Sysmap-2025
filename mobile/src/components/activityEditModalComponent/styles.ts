import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.white,
  },
  mapsContainer: {
    marginBottom: 13,
    gap: 12,
  },
  label: {
    fontFamily: THEME.FONTS.DMSans.semiBold,
    fontSize: 16,
    lineHeight: 20,
    color: THEME.COLORS.gray,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 31,
    marginTop: 76,
    width: '100%',
    marginBottom: 16,
    gap: 45,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 24,
    width: '100%',
  },
  formContainer: {
    alignItems: 'center',
    marginHorizontal: -20,
  },
  form: {
    width: '90%',
    gap: 24,
    marginTop: 34,
    marginBottom: 24,
  },
  visibilityContainer: {
    marginBottom: 21,
    gap: 14,
  },
  visibilityButtonContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  visibilityButton: {
    width: 100,
  },
  activityTypesContainer: {
    marginBottom: 26,
  },
  footerContainer: {
    marginBottom: 39,
    gap: 16,
  },
  errorLabel: {
    color: THEME.COLORS.red,
  },
  errorMessage: {
    fontFamily: THEME.FONTS.DMSans.semiBold,
    fontSize: 16,
    color: THEME.COLORS.red,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: THEME.COLORS.red,
    borderWidth: 1,
    borderRadius: 10,
  },
  mapContainer: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 205,
    marginBottom: 40,
  },
  imageLabel: {
    marginBottom: 8,
  },
  categoryLabel: {
    marginBottom: -15,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default styles;
