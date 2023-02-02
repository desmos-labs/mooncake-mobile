import { makeStyle } from 'config/theme';

/**
 * Style hook for the NoDtagFound screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
    justifyContent: 'center',
  },
  image: {
    width: 335,
    height: 116,
    alignSelf: 'center',
  },
  textGroup: {
    marginVertical: theme.spacing.l,
    alignItems: 'center',
  },
  headerText: {
    marginBottom: theme.spacing.m,
  },
  descriptionText: {
    textAlign: 'center',
  },
}));

export default useStyles;
