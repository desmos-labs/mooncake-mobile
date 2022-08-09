import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGrey,
  },
  topButtonContainer: {
    padding: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    width: 32,
    height: 32,
  },
  avatarContainer: {
    zIndex: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'contain',
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
  },
  contentGroup: {
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    marginTop: theme.spacing.m,
    flexGrow: 1,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  editButton: {
    width: 32,
    height: 32,
    alignSelf: 'flex-end',
  },
  nameText: {
    textAlign: 'center',
    marginTop: theme.spacing.m,
  },
  dTagText: {
    marginTop: theme.spacing.s,
    textAlign: 'center',
  },
  socialCounterGroup: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  separator: {
    backgroundColor: theme.colors.iconGrey,
    width: StyleSheet.hairlineWidth,
    height: '90%',
  },
  connectButtonGroup: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'stretch',
    height: 200,
  },
  tabContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    padding: theme.spacing.m,
  },
  snackbar: {
    zIndex: 2,
    backgroundColor: theme.colors.surface,
  },
}));

export default useStyles;
