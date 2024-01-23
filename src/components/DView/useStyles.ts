import { Props } from 'components/DView/index';
import { makeStyleWithProps } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  root: {
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: props.gradientColors ? undefined : theme.colors.background,
  },
  background: {
    width: '100%',
    bottom: props.backgroundFillScreen ? 0 : undefined,
    height: props.backgroundFillScreen ? undefined : verticalScale(230),
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  backgroundFillOverride: {
    bottom: 0,
    height: undefined,
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
