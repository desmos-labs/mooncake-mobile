import { makeStyle } from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  headerText: {
    textAlign: 'left',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
    alignSelf: 'center',
  },
  tableLeft: {
    borderRightWidth: 0,
    padding: 14,
    flex: 0.5,
    borderWidth: 1,
    flexGrow: 1,
    borderColor: '#EFEFEF',
  },
  tableRight: {
    flex: 0.5,
    borderWidth: 1,
    flexGrow: 1,
    padding: 14,
    borderColor: '#EFEFEF',
  },
  tableContainer: {
    flexDirection: 'column',
    borderColor: '#EFEFEF',
    borderRadius: 8,
    borderWidth: 1,
  },
  flexRow: { flexDirection: 'row' },
}));

export default useStyles;
