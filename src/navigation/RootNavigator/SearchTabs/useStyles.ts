import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  cancelIconContainer: {
    marginLeft: theme.spacings.m,
    position: 'absolute',
    left: 'auto',
    right: 14,
  },
  container: {
    marginTop: theme.spacings.xs,
    paddingBottom: theme.spacings.s,
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
    resizeMode: 'contain',
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: theme.spacings.l,
  },
  emptySearchContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
