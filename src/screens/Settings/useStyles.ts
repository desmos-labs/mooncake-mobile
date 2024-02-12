import { makeStyle } from 'config/theme';
import CommonStyles from 'config/theme/CommonStyles';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    paddingHorizontal: theme.spacings.m,
    paddingBottom: theme.spacings.xl,
  },
  scrollview: {
    marginTop: -16,
    marginHorizontal: -16,
    marginBottom: theme.spacings.m,
  },
  scrollViewContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: theme.spacings.m,
  },
  innerButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 0,
  },
  section: {
    marginBottom: 24,
    ...CommonStyles.shadows.Shadows,
  },
  bottomText: {
    textAlign: 'center',
    marginVertical: theme.spacings.m,
  },
}));

export default useStyles;
