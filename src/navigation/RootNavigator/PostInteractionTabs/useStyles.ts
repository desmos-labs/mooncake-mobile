import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

/**
 * Style hook for the PostInteractionTabs tab navigator
 */
const useStyles = makeStyle(theme => ({
  container: {
    height: Dimensions.get('window').height * 0.7,
    marginVertical: theme.spacing.m,
  },
  sceneContainerStyle: {
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
