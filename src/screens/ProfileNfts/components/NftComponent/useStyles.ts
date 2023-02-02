import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
  },
  image: {
    width: '100%',
    height: 158,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  innerStyle: {
    width: '100%',
    height: 158,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  buttonContainer: { backgroundColor: theme.colors.white, borderRadius: 12 },
  textGroup: { padding: 12, alignItems: 'flex-start' },
}));

export default useStyles;
