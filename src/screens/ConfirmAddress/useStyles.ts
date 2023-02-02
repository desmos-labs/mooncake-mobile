import { makeStyle } from 'config/theme';

/**
 * Style hook for the ConfirmAddress screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
  },
  addressPreviewBox: {
    backgroundColor: theme.colors.backgroundGrey,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
    marginBottom: 60,
    alignItems: 'center',
    borderRadius: 8,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
}));

export default useStyles;
