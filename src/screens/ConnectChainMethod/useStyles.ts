import {makeStyle} from 'config/theme';

/**
 * Style hook for the ConnectChainMethod screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  descriptionText: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xl,
  },
}));

export default useStyles;
