import {makeStyle} from 'config/theme';
import {scale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    padding: theme.spacing.m,
  },
  contentContainer: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    flexWrap: 'wrap',
    left: scale(6),
  },
}));
export default useStyles;
