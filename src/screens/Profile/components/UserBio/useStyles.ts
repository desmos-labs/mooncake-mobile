import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  dummyBio: {
    position: 'absolute',
    opacity: 0,
  },
  moreText: {
    backgroundColor: theme.colors.background,
    color: theme.colors.accentBlue02,
  },
  gradientContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: 4,
  },
  gradient: {
    width: 50,
  },
}));

export default useStyles;
