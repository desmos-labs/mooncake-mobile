import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

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
    marginTop: -80,
    width: verticalScale(220),
    height: verticalScale(220),
  },
  textView: {
    marginTop: 40,
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
  paginationView: { alignSelf: 'center', marginTop: -80, marginBottom: 40 },
}));

export default useStyles;
