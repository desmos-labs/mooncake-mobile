import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    height: verticalScale(110),
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButtonText: {
    color: theme.colors.surfaceBlack,
    marginRight: 4,
  },
  infoButtonIcon: {
    width: 22,
    height: 22,
  },
}));

export default useStyles;
