import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backImage: {
    height: 32,
    width: 32,
    marginLeft: theme.spacing.m,
    marginBottom: 10,
  },
  dropShadow: {marginHorizontal: theme.spacing.m, marginTop: 10},
  nftImage: {
    width: '100%',
    height: 332,
    resizeMode: 'cover',
    borderRadius: theme.roundness,
  },
  backgroundImage: {
    width: '100%',
    resizeMode: 'cover',
    height: 400,
  },
  imageAbsolute: {
    position: 'absolute',
    width: '100%',
    height: 400,
  },
}));

export default useStyles;
