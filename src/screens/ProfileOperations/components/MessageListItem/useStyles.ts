import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacings.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
  },
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileView: {
    marginLeft: theme.spacings.s,
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '50%',
  },
  formattedDate: {
    marginTop: theme.spacings.s,
    color: theme.colors.neutralVariants['600'],
  },
}));

export default useStyles;
