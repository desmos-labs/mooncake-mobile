import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    alignItems: 'center',
    padding: theme.spacing.s,
  },
  iconStyle: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 50 / 2,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  textGroup: {
    marginLeft: theme.spacing.s,
  },
}));

export default useStyles;
