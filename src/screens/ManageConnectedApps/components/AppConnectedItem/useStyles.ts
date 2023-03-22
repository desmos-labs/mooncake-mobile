import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  baseText: {
    color: theme.colors.surfaceBlack,
  },
  addressText: {
    color: theme.colors.grey01,
  },
  disconnectText: {
    color: theme.colors.butterOrange01,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  icon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
  centerGroup: {
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  addressGroup: {
    flexDirection: 'row',
    maxWidth: '80%',
  },
  copyIcon: {
    marginLeft: theme.spacing.xs,
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: theme.colors.surfaceBlack,
  },
  disconnectButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 4,
  },
  unverifiedIcon: {
    tintColor: 'rgba(221, 221, 221, 1)',
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 4,
  },
}));

export default useStyles;
