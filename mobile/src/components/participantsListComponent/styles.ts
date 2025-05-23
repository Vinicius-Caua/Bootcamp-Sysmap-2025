import {StyleSheet, Dimensions} from 'react-native';
import THEME from '../../assets/themes/THEME';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  participantsListContainer: {
    width: '100%',
    paddingHorizontal: 8,
    backgroundColor: THEME.COLORS.white,
    paddingVertical: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  flatList: {
    width: '100%',
    maxHeight: 240,
  },
  participantsPage: {
    width: screenWidth - 32,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 100,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  participantName: {
    fontFamily: THEME.FONTS.Bebas.regular,
    fontSize: 16,
  },
  statusText: {
    fontFamily: THEME.FONTS.Bebas.regular,
    fontSize: 16,
  },
  creatorText: {
    fontFamily: THEME.FONTS.DMSans.medium,
    color: THEME.COLORS.grayBlue,
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto', // Push to the right
    marginRight: 20,
  },
  actionButton: {
    width: 27,
    height: 27,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 22,
  },
  approveButton: {
    backgroundColor: THEME.COLORS.emerald,
  },
  rejectButton: {
    backgroundColor: THEME.COLORS.emerald,
  },
  actionButtonText: {
    color: THEME.COLORS.white,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: THEME.COLORS.gray,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default styles;
