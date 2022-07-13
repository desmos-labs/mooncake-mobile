import {makeStyle} from 'config/theme';
import {Platform, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
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
    paddingVertical: 14,
  },
  editButton: {
    width: 32,
    height: 32,
    alignSelf: 'flex-end',
  },
  nameText: {
    textAlign: 'center',
    marginTop: theme.spacing.s,
  },
  dTagText: {
    textAlign: 'center',
  },
  socialCounterGroup: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  separator: {
    backgroundColor: theme.colors.icon[3],
    width: StyleSheet.hairlineWidth,
    height: '90%',
  },
  connectButtonGroup: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  connectButton: {
    width: scale(140),
    height: 40,
  },
  connectButtonText: {
    color: theme.colors.primary,
    lineHeight: Platform.select({
      ios: 20,
      android: 23,
    }),
    fontSize: 12,
  },
  connectButtonContent: {
    height: '100%',
  },
}));

export default useStyles;
