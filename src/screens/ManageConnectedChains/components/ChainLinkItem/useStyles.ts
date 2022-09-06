import {makeStyle} from 'config/theme';

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
    margin: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  icon: {
    width: 40,
    height: 40,
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
    tintColor: theme.colors.grey01,
  },
  disconnectButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;
