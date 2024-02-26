import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  button: {
    alignSelf: 'flex-end',
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacings.s,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryVariants['100'],
    gap: 4,
  },
  icon: { height: 24, width: 24 },
  text: { color: theme.colors.primary },
}));

export default useStyles;
