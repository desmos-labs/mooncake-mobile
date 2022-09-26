import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  flatList: {
    backgroundColor: 'transparent',
  },
}));

export default useStyles;
