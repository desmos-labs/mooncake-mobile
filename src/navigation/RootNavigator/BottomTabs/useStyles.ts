import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  middleButtonView: {
    flex: 1,
    marginHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.l,
  },
  buttonView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  overlayImage: {
    width: 24,
    height: 24,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
}));

export default useStyles;
