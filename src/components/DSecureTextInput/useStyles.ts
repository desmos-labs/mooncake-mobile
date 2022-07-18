import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  input: {
    backgroundColor: theme.colors.white,
  },
  focused: {
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.primary,
  },
  eyeIcon: {
    right: theme.spacing.s,
  },
}));

export default useStyles;
