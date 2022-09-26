import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  button: {
    padding: theme.spacing.s,
    color: theme.colors.white,
  },
  textButton: {
    color: theme.colors.surfaceBlack,
    textTransform: 'none',
  },
  buttonLabel: {
    color: theme.colors.white,
    textTransform: 'none',
  },
}));

export default useStyles;
