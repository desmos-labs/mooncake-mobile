import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {flex: 1, paddingVertical: theme.spacing.m},
  button: {
    marginTop: theme.spacing.m,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
}));

export default useStyles;
