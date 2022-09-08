import {makeStyle} from 'config/theme';
import {Dimensions, StyleSheet} from 'react-native';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGrey,
  },
  avatarContainer: {
    zIndex: 2,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    resizeMode: 'contain',
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
  },
  contentGroup: {
    overflow: 'hidden',
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
    resizeMode: 'cover',
    height: Dimensions.get('window').height * 0.7,
  },
  tabContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    padding: theme.spacing.m,
  },
  snackbar: {
    zIndex: 2,
    backgroundColor: theme.colors.surface,
  },
  contentContainerStyle: {
    flexGrow: 1,
    minHeight: Dimensions.get('screen').height * 1.5,
    backgroundColor: theme.colors.background,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    overflow: 'visible',
  },
}));

export default useStyles;
