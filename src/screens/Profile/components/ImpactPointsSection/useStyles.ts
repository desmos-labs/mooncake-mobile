import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    height: verticalScale(110),
  },
}));

export default useStyles;
