import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
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
