import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  pic: {
    margin: 5,
    borderRadius: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
    backgroundColor: theme.colors.background,
  },
  dTagStyle: {
    color: theme.colors.grey02,
  },
}));

export default useStyles;
