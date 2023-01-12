import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  middleButtonView: {
    flex: 1,
    marginHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
  },
  buttonView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
}));

export default useStyles;
