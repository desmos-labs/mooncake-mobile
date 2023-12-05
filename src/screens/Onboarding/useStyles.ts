import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';

export const fixedWidth = Dimensions.get('window').width;

const useStyles = makeStyle(theme => ({
  background: {
    position: 'absolute',
    height: 750,
    width: fixedWidth,
    top: -100,
  },
  root: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  contentView: {
    flex: 1,
    justifyContent: 'center',
    width: fixedWidth,
  },
  imageStyle: {
    width: verticalScale(150),
    height: verticalScale(150),
  },
  textView: {
    marginTop: 80,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    width: fixedWidth,
  },
  button: {
    marginHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
