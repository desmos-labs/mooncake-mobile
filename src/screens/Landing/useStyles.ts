import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: verticalScale(56),
  },
  dummyAvatar: {
    width: 129,
    height: 129,
    resizeMode: 'contain',
    borderRadius: 64.5,
  },
  headerStyle: {
    marginTop: 46,
    marginBottom: 50,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    color: theme.colors.white,
  },
  connectLedgerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectLedgerImage: {
    width: 24,
    height: 20,
    resizeMode: 'contain',
    marginRight: theme.spacing.s,
  },
}));

export default useStyles;
