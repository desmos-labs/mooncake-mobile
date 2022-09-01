import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  view: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 140,
  },
  image: {
    width: 230,
    height: 116,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
  subtitle1: {
    width: '100%',
    textAlign: 'center',
  },
}));

export default useStyles;
