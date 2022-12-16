import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((props: any, theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.s,
    paddingBottom: 80,
  },
  profileTopBarContainer: {
    flex: 1,
  },
  buttonStyleLeft: {
    zIndex: 3,
    position: 'absolute',
    top: props.insets.top + 10,
    left: 20,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleRight: {
    zIndex: 3,
    position: 'absolute',
    top: props.insets.top + 10,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarImage: {height: 32, width: 32},
  divider: {
    marginHorizontal: -theme.spacing.m,
    height: 8,
    backgroundColor: theme.colors.surfaceGrey,
  },
}));

export default useStyles;
