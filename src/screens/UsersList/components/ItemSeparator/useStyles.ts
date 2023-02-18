import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  itemSeparator: {
    flexGrow: 1,
    margin: 7,
    height: 1,
    minHeight: 1,
    maxHeight: 1,
    backgroundColor: 'rgb(239,239,239)',
  },
}));

export default useStyles;
