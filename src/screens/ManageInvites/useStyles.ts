import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGrey,
  },
  textContainer: {flexDirection: 'column', paddingLeft: theme.spacing.m},
  banner: {
    width: 125,
    height: 175,
    right: 0,
    marginLeft: 'auto',
    marginTop: -45,
  },
}));

export default useStyles;
