import { makeStyle } from 'config/theme';
import { Platform } from 'react-native';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingBottom: Platform.OS === 'android' ? theme.spacing.s : 0,
    paddingTop: theme.spacing.s,
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
    marginHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.s,
  },
  buttonView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageButton: {
    height: 32,
    width: 32,
    alignSelf: 'center',
  },
  imageButtonOverlay: {
    left: 18,
    top: 2,
  },
  middleButtonImage: {
    height: 41,
    width: 41,
    alignSelf: 'center',
  },
}));

export default useStyles;
