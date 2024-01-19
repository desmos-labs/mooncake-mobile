import { makeStyleWithProps } from 'config/theme';
import { Props } from './index';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  root: {
    height: props.height || 44,
    // We fall back to `lightTheme.spacings.roundness` in case the theme.spacings is undefined.
    // This is needed when this component is used outside the <ThemeProvider>.
    borderRadius: 12,
    paddingHorizontal: theme.spacing?.m ?? theme.spacing.m,
  },
  innerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: 40,
    height: 40,
  },
  disabled: {
    opacity: 0.5,
  },
}));

export default useStyles;
