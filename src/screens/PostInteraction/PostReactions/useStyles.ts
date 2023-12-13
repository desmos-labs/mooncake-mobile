import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

/**
 * Style hook for the PostReactions screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    height: Dimensions.get('window').height * 0.7,
    paddingTop: theme.spacing.l,
  },
  header: {
    alignSelf: 'center',
    marginBottom: theme.spacing.m,
  },
  countText: {
    color: theme.colors.midGrey,
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.l,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
}));

export default useStyles;
