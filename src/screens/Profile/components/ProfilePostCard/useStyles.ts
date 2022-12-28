import {makeStyleWithProps} from 'config/theme';
import {scale, verticalScale} from 'react-native-size-matters';

/**
 * Style hook for the ProfilePostCard component
 */
const useStyles = makeStyleWithProps((props: any, theme) => ({
  container: {
    borderRadius: 18,
    backgroundColor: theme.colors.butterOrange01,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: theme.spacing.m,
    width: scale(props.size),
    height: verticalScale(145),
    alignSelf: 'center',
    margin: props.margin,
  },
  textStyle: {
    color: theme.colors.white,
    fontSize: 8,
    lineHeight: 15,
  },
}));

export default useStyles;
