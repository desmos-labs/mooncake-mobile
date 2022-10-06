import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  iconStyle: {
    borderWidth: 0.5,
    borderColor: theme.colors.lightGrey01,
    width: 43,
    height: 43,
    resizeMode: 'contain',
    borderRadius: 43 / 2,
    marginRight: theme.spacing.xs,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  textGroup: {
    marginLeft: theme.spacing.s,
  },
}));

export default useStyles;
