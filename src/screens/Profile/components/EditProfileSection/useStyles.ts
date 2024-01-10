import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  editButton: {
    backgroundColor: theme.colors.surfaceGrey,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
  },
  connectButton: {
    backgroundColor: theme.colors.surfaceGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 35,
    width: 40,
  },
  icon: { height: 22, width: 22 },
}));

export default useStyles;
