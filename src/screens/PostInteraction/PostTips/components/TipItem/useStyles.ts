import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  avatarStyle: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    marginRight: theme.spacing.s,
  },
  textStyle: {
    maxWidth: 150,
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
