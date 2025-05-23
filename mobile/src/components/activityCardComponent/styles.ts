import {StyleSheet} from 'react-native';
import THEME from '../../assets/themes/THEME';

const styles = StyleSheet.create({
  imagemCard: {
    height: 160,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
  activityTitle: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: THEME.FONTS.DMSans.semiBold,
    color: THEME.COLORS.black,
    width: 354,
  },
  containerSubInformations: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    width: 354,
  },
  subInformations: {
    fontSize: 12,
    fontFamily: THEME.FONTS.DMSans.regular,
    color: THEME.COLORS.gray,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partcipantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    backgroundColor: THEME.COLORS.emerald,
    borderRadius: 100,
    padding: 8,
  },
});

export default styles;
