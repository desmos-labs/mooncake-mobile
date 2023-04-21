import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  profileView: {
    marginLeft: theme.spacing.s,
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '50%',
  },
  formattedDate: {
    color: theme.colors.grey02,
    marginTop: theme.spacing.s,
  },
  feesText: {
    right: 0,
    marginLeft: 'auto',
    color: theme.colors.red01,
  },
}));

export default useStyles;
