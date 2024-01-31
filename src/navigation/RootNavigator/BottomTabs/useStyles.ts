import { makeStyle } from 'config/theme';
import { Platform } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingBottom: Platform.OS === 'android' ? -12 : -22,
    paddingTop: 2,
    paddingHorizontal: theme.spacing.m,
    shadowColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  middleButtonView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.s,
    paddingBottom: 6,
  },
  buttonView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  profile: {
    alignSelf: 'center',
    width: scale(22),
    height: scale(22),
    borderRadius: scale(22 / 2),
    marginBottom: 8,
  },
  profileFocused: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  imageButton: {
    height: 26,
    width: 26,
    alignSelf: 'center',
  },
  middleButtonImage: {
    height: 56,
    width: 56,
    alignSelf: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    alignSelf: 'center',
    marginBottom: 16,
  },
  dotInactive: {
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
