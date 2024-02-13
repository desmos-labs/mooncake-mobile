import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  butterflyImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    marginRight: theme.spacings.xs,
  },
  butterFlyImageContainer: { position: 'absolute', left: 0, right: 'auto' },
  inviteIconContainer: { position: 'absolute', left: 'auto', right: 0 },
  cancelIconContainer: {
    marginLeft: theme.spacings.m,
    position: 'absolute',
    left: 'auto',
    right: 0,
  },
  container: {
    marginTop: theme.spacings.xs,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.white,
  },
  animatedView: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    marginTop: theme.spacings.xs,
    justifyContent: 'center',
  },
  rightButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacings.xs,
  },
  icon: {
    width: 36,
    height: 36,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mooncakeLogo: {
    width: 114,
    height: 26,
  },
}));

export default useStyles;
