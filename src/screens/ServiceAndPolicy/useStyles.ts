import { makeStyle } from 'config/theme';
import { Platform } from 'react-native';

const useStyles = makeStyle(theme => ({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonsContainer: {
    backgroundColor: 'white',
    shadowColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderRadius: 20,
    elevation: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: theme.colors.surfaceGrey,
  },
  bottomView: { flex: 1, alignSelf: 'center', justifyContent: 'flex-end' },
}));

export default useStyles;
