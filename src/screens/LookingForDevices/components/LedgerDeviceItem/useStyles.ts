import {makeStyle} from 'config/theme';

/**
 * Style hook for the LedgerDeviceItem component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    color: theme.colors.font[1],
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
