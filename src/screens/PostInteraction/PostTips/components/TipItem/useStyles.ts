import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  avatarStyle: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    marginRight: theme.spacing.s,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  subTextStyle: {
    color: theme.colors.grey02,
  },
  textGroup: {
    flex: 1,
  },
}));

export default useStyles;
