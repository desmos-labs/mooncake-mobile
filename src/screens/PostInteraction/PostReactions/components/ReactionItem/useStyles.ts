import { makeStyle } from 'config/theme';
import { scale, verticalScale } from 'react-native-size-matters';

/**
 * Style hook for the ReactionItem component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacings.m,
    alignItems: 'center',
  },
  textStyle: {
    color: theme.colors.neutralVariants['900'],
  },
  subTextStyle: {
    color: theme.colors.neutralVariants['600'],
  },
  textGroup: {
    flex: 1,
  },
  avatarStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacings.s,
  },
  buttonContainer: {
    width: scale(83),
    height: verticalScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfollowText: {
    color: theme.colors.primary,
  },
  followText: {
    color: theme.colors.white,
  },
  likedIcon: {
    height: scale(24),
    width: scale(24),
    resizeMode: 'contain',
    tintColor: theme.colors.primary,
  },
}));

export default useStyles;
