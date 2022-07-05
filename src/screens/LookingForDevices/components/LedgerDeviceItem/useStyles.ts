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
}));

export default useStyles;
