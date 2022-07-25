import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

export default useStyles;
