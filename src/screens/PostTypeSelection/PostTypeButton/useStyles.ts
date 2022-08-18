import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 44,
    paddingHorizontal: 34,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  buttonImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 12,
  },
}));

export default useStyles;
