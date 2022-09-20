import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceBlack,
  },
  cancelText: {
    color: theme.colors.white,
    marginHorizontal: theme.spacing.m,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  columnWrapperStyle: {
    paddingBottom: theme.spacing.s,
    justifyContent: 'space-evenly',
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
}));

export default useStyles;
