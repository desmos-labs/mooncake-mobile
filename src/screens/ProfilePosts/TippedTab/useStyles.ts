import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainerStyle: {
    alignItems: 'flex-start',
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
}));

export default useStyles;
