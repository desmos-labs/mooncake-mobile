import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  loadingContainer: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
}));

export default useStyles;
