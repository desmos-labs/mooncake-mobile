import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    paddingBottom: theme.spacings.m,
  },
  header: {
    marginTop: theme.spacings.l,
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
  quickSelectButtonText: {
    color: theme.colors.neutralVariants['900'],
  },
  inputContainer: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: theme.spacings.s,
    paddingVertical: theme.spacings.m,
  },
  availableText: {
    marginTop: 12,
    color: theme.colors.feedback.success,
  },
  errorText: {
    marginTop: 12,
    color: theme.colors.feedback.error,
  },
}));

export default useStyles;
