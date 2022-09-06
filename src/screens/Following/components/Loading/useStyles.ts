import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  loadingContainer: {
    flexGrow: 1,
    paddingVertical: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
}));

export default useStyles;
