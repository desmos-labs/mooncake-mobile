import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  tabContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  interactionButtonGroup: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
}));

export default useStyles;
