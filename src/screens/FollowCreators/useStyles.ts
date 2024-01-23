import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    paddingHorizontal: 20,
  },
  neutral700: {
    color: theme.colors.neutral['700'],
  },
  listWrapper: { flex: 1, marginHorizontal: -20, marginVertical: 20 },
  contentContainerStyle: { paddingHorizontal: 20, paddingVertical: 20 },
}));

export default useStyles;
