import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

/**
 * Style hook for the PostInteractionTabs tab navigator
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
  },
  animatedContainer: {
    // uncommenting this will make the view not stick to bottom
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    // paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    height: Dimensions.get('window').height * 0.9,
  },
  bar: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 4,
    // design calls for foundation/grey03, but it does not exist on the color table
    backgroundColor: '#DEDEDE',
  },
  barContainer: {
    paddingBottom: theme.spacing.m,
  },
  sceneContainerStyle: {
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
