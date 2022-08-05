import {makeStyle} from 'config/theme';

/**
 * Style hook for the ConnectAddress general and advanced screens
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  modeButtonText: {
    color: theme.colors.primary,
  },
  topBarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
}));

export default useStyles;
