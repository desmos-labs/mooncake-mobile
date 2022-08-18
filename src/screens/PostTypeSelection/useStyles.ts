import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
  permissionsGroup: {
    flex: 1,
    justifyContent: 'center',
  },
}));

export default useStyles;
