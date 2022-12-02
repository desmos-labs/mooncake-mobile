import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGrey,
  },
  textContainer: {flexDirection: 'column', paddingLeft: theme.spacing.m},
  banner: {
    width: 140,
    height: 240,
    right: 0,
    marginLeft: 'auto',
    top: -100,
  },
}));

export default useStyles;
