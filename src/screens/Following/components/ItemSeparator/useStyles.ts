import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => ({
  itemSeparator: {
    flexGrow: 1,
    margin: 10,
    height: 1,
    backgroundColor: 'rgb(239,239,239)',
  },
}));

export default useStyles;
