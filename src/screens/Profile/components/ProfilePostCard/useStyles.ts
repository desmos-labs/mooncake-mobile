import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

/**
 * Theme hook for the ProfilePostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: theme.spacing.m,
    width: scale(97),
    height: verticalScale(145),
    alignSelf: 'center',
    margin: theme.spacing.xs,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  textStyle: {
    color: theme.colors.font[5],
    fontSize: 8,
  },
}));

export default useStyles;
