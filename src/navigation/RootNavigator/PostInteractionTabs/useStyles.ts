import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

/**
 * Style hook for the PostInteractionTabs tab navigator
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
  },
  animatedContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  bar: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 4,
    // design calls for foundation/grey03, but it does not exist on the color table
    backgroundColor: theme.colors.grey02,
  },
}));

export default useStyles;
