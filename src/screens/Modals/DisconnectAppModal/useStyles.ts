import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.m,
  },
  innerContainer: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  chainImageGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  disconnectIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: theme.spacing.l,
  },
  chainIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  confirmButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
}));

export default useStyles;
