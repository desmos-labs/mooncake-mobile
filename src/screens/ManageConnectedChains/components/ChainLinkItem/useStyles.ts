import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  baseText: {
    color: theme.colors.black,
  },
  addressText: {
    color: theme.colors.grey01,
  },
  disconnectText: {
    color: theme.colors.desmosOrange01,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
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
    width: '50%',
  },
  copyIcon: {
    marginLeft: theme.spacing.s,
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
