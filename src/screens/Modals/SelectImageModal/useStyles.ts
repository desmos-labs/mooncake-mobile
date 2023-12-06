import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  contentView: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.l,
    margin: theme.spacing.l,
    borderRadius: 16,
  },
  header: { textAlign: 'center' },
  activityIndicator: {
    alignSelf: 'center',
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  image: {
    width: 60,
    height: 60,
    marginRight: theme.spacing.m,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
