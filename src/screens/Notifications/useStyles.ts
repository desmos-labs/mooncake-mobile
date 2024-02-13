import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingTop: theme.spacings.m,
  },
  flexCenter: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
  },
  sectionHeader: {
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacings.s,
    paddingHorizontal: theme.spacings.m,
    paddingBottom: theme.spacings.s,
  },
  emptyView: {
    paddingHorizontal: theme.spacings.m,
    height: Dimensions.get('window').height / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: theme.spacings.s,
  },
  errorImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
    marginBottom: theme.spacings.s,
  },
}));

export default useStyles;
