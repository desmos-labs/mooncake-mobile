import { makeStyleWithProps } from 'config/theme';

const useStyles = makeStyleWithProps((props: any, theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
    marginTop: theme.spacing.m,
    paddingBottom: 80,
  },
  profileTopBarContainer: {
    flex: 1,
  },
  buttonStyleLeft: {
    zIndex: 3,
    position: 'absolute',
    top: props.insets.top + 6,
    left: 20,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarImage: { height: 32, width: 32 },
  divider: {
    marginHorizontal: -theme.spacing.m,
    height: 8,
    backgroundColor: theme.colors.surfaceGrey,
  },
  flexCenter: { flex: 1, justifyContent: 'center' },
  arrowView: {
    zIndex: 2,
    position: 'absolute',
    top: props.insets.top + 13,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  animatedDtag: {
    zIndex: 2,
    position: 'absolute',
    top: props.insets.top + 7,
    left: 0,
    right: 0,
  },
  dtag: {
    color: theme.colors.white,
    alignSelf: 'center',
    maxWidth: '25%',
  },
  centerLeftSpacingM: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.m,
  },
  editButton: {
    backgroundColor: theme.colors.surfaceGrey,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flex: 0.95,
  },
  unfollowButton: {
    height: 32,
    backgroundColor: theme.colors.surfaceGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.roundness,
  },
  followButton: {
    height: 32,
    backgroundColor: theme.colors.surfaceBlack,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.roundness,
  },
}));

export default useStyles;
