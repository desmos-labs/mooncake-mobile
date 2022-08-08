import {makeStyle} from 'config/theme';

/**
 * Style hook for the ConnectChainTxDetail screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  chainImageGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.l,
  },
  connectIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: theme.spacing.l,
  },
  chainIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  valueStyle: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
