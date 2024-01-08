import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  header: {
    marginTop: theme.spacing.l,
    alignSelf: 'center',
  },
  subtitle: {
    marginTop: 20,
  },
  quickSelectorRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  quickSelectButton: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.m,
  },
  availableText: {
    marginTop: 12,
    color: theme.colors.accentGreen01,
  },
  errorText: {
    marginTop: 12,
    color: theme.colors.accentRed01,
  },
}));

export default useStyles;
