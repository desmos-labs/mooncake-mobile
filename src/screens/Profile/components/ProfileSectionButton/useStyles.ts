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
    marginHorizontal: 20,
    marginBottom: 16,
  },
}));

export default useStyles;
