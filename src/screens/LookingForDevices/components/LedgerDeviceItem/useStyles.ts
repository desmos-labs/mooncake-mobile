import {makeStyle} from 'config/theme';

/**
 * Style hook for the LedgerDeviceItem component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.roundness,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    color: theme.colors.surfaceBlack,
    marginLeft: 20,
  },
  ledgerIconStyle: {
    width: 6.1,
    height: 32,
    resizeMode: 'contain',
  },
  checkImage: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  hidden: {
    opacity: 0,
  },
}));

export default useStyles;
