import {StyleSheet} from 'react-native';
import THEME from '../../../../assets/themes/THEME';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: THEME.COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: THEME.COLORS.white,
  },
  backgroundImageContainer: {
    width: '100%',
    height: 370,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 76,
    marginLeft: 41,
  },
  touchableButtons: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    flex: 1,
    alignItems: 'center',
  },
  smallHeader: {
    flexDirection: 'row',
    backgroundColor: THEME.COLORS.white,
    width: '80%',
    height: 61,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 210,
    borderRadius: 10,
    gap: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partcipantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  isPrivateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: THEME.COLORS.white,
    paddingHorizontal: 24,
    marginBottom: 37,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 28,
    gap: 33,
  },
  title: {
    fontSize: 20,
    fontFamily: THEME.FONTS.Bebas.regular,
    paddingLeft: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: THEME.FONTS.DMSans.regular,
    color: THEME.COLORS.grayBlue,
  },
  mapContainer: {
    marginTop: 55,
    marginBottom: 42,
    gap: 12,
  },
  participantsContainer: {
    gap: 12,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 37,
  },
  textHeader: {
    fontFamily: THEME.FONTS.DMSans.regular,
    fontSize: 12,
  },
  checkInCodeContainer: {
    gap: 24,
    marginTop: 30,
  },
});

export default styles;
