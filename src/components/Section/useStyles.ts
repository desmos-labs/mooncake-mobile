import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  title: {
    color: theme.colors.font['2'],
    marginBottom: theme.spacing.s,
  },
  fieldsContainer: {
    backgroundColor: theme.colors.background2,
    borderRadius: theme.roundness,
  },
  spacer: {
    marginBottom: theme.spacing.s,
  },
}));

export default useStyles;
