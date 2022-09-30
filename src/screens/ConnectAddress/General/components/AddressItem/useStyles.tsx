import {makeStyle} from 'config/theme';
import {scale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.m,
    borderRadius: 12,
  },
  indexStyle: {
    color: theme.colors.butterOrange01,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  addressStyle: {
    width: scale(110),
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
