import {makeStyle} from 'config/theme';
import {scale, verticalScale} from 'react-native-size-matters';

/**
 * Style hook for the ProfilePostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: theme.spacing.m,
    width: scale(97),
    height: verticalScale(145),
    alignSelf: 'center',
    margin: theme.spacing.xs,
  },
  textStyle: {
    color: theme.colors.font[5],
    fontSize: 8,
    lineHeight: 15,
  },
}));

export default useStyles;
