import { makeStyle } from 'config/theme';

/**
 * Style hook for the ConnectChainMethodButton component
 */
const useStyles = makeStyle(theme => ({
  container: {
    justifyContent: 'center',
    paddingVertical: 37,
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
  },
  buttonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textStyle: {
    marginTop: theme.spacing.m,
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
}));

export default useStyles;
