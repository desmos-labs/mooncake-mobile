import {makeStyle} from 'config/theme';

/**
 * Style hook for the ProfilePostCard component
 */
const useStyles = makeStyle(theme => ({
  button: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    minHeight: 80,
  },
  sectionGroup: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
}));

export default useStyles;
