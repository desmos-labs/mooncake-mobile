import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  editButton: {
    backgroundColor: theme.colors.surfaceGrey,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flex: 0.95,
  },
  connectButton: {
    backgroundColor: theme.colors.surfaceGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 35,
    width: 40,
  },
}));

export default useStyles;
