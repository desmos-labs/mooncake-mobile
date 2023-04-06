import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
  },
}));

export default useStyles;
