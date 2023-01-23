import {makeStyle} from 'config/theme';
import {Dimensions} from 'react-native';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingTop: theme.spacing.m,
  },
  flexCenter: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
  },
  sectionHeader: {
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  emptyView: {
    paddingHorizontal: theme.spacing.m,
    height: Dimensions.get('window').height / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: theme.spacing.s,
  },
  errorImage: {
    width: 139,
    height: 163.55,
    resizeMode: 'cover',
  },
}));

export default useStyles;
