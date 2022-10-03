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
    marginVertical: 40,
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
    flex: 1,
    marginTop: theme.spacing.m,
    justifyContent: 'flex-end',
  },
}));

export default useStyles;
