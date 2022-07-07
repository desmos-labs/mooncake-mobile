import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  containerRight: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
}));

export default useStyles;
