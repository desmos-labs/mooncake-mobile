import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
}));

export default useStyles;
