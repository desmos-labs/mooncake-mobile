import { Props } from 'components/DView/index';
import { makeStyleWithProps } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyleWithProps((background: Props, theme) => ({
  root: {
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    width: '100%',
    bottom: background.backgroundFillScreen ? 0 : undefined,
    height: background.backgroundFillScreen ? undefined : verticalScale(230),
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  backgroundFillOverride: {
    bottom: 0,
    height: undefined,
  },
  content: {
    zIndex: 1,
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: background === undefined ? theme.colors.background : 'transparent',
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
}));

export default useStyles;
