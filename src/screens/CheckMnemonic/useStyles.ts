import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
  },
  selectedWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.m,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.surface,
    flexGrow: 1,
    maxHeight: '40%',
    paddingHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.white,
  },
  availableWordsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
    flexGrow: 1,
  },
  wordBadge: {
    marginTop: theme.spacing.s,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  wordBadgeSelected: {
    marginTop: theme.spacing.s,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    backgroundColor: theme.colors.yellow03,
  },
  errorParagraph: {
    marginVertical: theme.spacing.s,
    color: theme.colors.pink01,
  },
  errorContainer: {
    marginTop: theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default useStyles;
