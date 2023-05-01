import { makeStyleWithProps } from 'config/theme';

const useStyles = makeStyleWithProps((props: any, theme) => ({
  flexRow: {
    flexDirection: 'row',
  },
  flexStart: { alignSelf: 'flex-start' },
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
  buttonStyleRight: {
    zIndex: 3,
    position: 'absolute',
    top: props.insets.top + 6,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextButtonPosition: {
    zIndex: 3,
    position: 'absolute',
    top: props.insets.top + 6,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextButtonStyle:{
    height: 32,
    width: 32,
  },
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
  innerContainer: { flexDirection: 'row', right: 0, marginLeft: 'auto' },
  profileTopBarContainer: {
    flex: 1,
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
  nickname: {
    marginTop: 10,
  },
  profileDtag: {
    marginVertical: 4,
    color: theme.colors.darkGrey,
  },
  postCount: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  r20: {
    right: 20,
  },
}));

export default useStyles;
