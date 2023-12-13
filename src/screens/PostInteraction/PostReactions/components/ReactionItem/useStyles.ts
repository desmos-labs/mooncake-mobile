import { makeStyle } from 'config/theme';
import { scale, verticalScale } from 'react-native-size-matters';

/**
 * Style hook for the ReactionItem component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
    alignItems: 'center',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  subTextStyle: {
    color: theme.colors.grey02,
  },
  textGroup: {
    flex: 1,
  },
  avatarStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.s,
  },
  buttonContainer: {
    width: scale(83),
    height: verticalScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfollowText: {
    color: theme.colors.butterOrange01,
  },
  followText: {
    color: theme.colors.white,
  },
  likedIcon: {
    height: scale(24),
    width: scale(24),
    resizeMode: 'contain',
    tintColor: theme.colors.butterOrange01,
  },
}));

export default useStyles;
