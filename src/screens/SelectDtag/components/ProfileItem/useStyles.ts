import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 20,
  },
  avatar: {
    width: 46,
    height: 46,
    marginRight: theme.spacing.m,
  },
}));

export default useStyles;
