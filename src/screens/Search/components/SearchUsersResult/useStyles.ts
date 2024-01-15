import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  avatar: {
    height: scale(42),
    width: scale(42),
    borderRadius: scale(21),
    backgroundColor: theme.colors.backgroundGrey,
    marginRight: theme.spacing.s,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

export default useStyles;
