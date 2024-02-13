import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

/**
 * Style hook for the PostReactions screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    height: Dimensions.get('window').height * 0.7,
    paddingTop: theme.spacings.l,
  },
  header: {
    alignSelf: 'center',
    marginBottom: theme.spacings.m,
  },
  countText: {
    color: theme.colors.midGrey,
    paddingHorizontal: theme.spacings.m,
    marginTop: theme.spacings.s,
    marginBottom: theme.spacings.l,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
}));

export default useStyles;
