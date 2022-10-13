import {makeStyle} from 'config/theme';
import {Dimensions, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  avatarContainer: {
    zIndex: 2,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    resizeMode: 'cover',
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
  },
  contentGroup: {
    overflow: 'hidden',
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
    marginTop: theme.spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  separator: {
    backgroundColor: theme.colors.iconGrey,
    width: StyleSheet.hairlineWidth,
    height: '90%',
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'cover',
    height: Dimensions.get('window').height * 0.6,
  },
  snackbar: {
    zIndex: 2,
    backgroundColor: theme.colors.surface,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  },
  connectButtonGroup: {
    flex: 1,
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  connectButton: {
    height: 42,
    width: scale(150),
    flex: 1,
  },
}));

export default useStyles;
