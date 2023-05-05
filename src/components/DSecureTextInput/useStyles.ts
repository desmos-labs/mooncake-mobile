import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  input: {
    backgroundColor: theme.colors.white,
  },
  focused: {
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.primary,
  },
  error: {
    borderColor: theme.colors.pink01,
  },
  icon: {
    width: 24,
    height: 17.25,
  },
}));

export default useStyles;
