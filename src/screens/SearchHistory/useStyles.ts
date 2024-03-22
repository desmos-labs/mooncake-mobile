import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacings.m,
  },
  emptyRoot: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    backgroundColor: theme.colors.white,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: theme.spacings.l,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacings.s,
    paddingBottom: theme.spacings.m,
  },
}));

export default useStyles;
