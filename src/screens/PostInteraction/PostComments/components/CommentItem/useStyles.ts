import {makeStyle} from 'config/theme';

/**
 * Style hook for the CommentItem component
 */
const useStyles = makeStyle(theme => ({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
  },
  flexRow: {
    flexDirection: 'row',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    marginRight: theme.spacing.s,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  subTextStyle: {
    color: theme.colors.grey02,
  },
  likedStyle: {
    color: theme.colors.desmosOrange01,
  },
  buttonImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: theme.colors.surfaceBlack,
  },
  interactionImage: {
    marginRight: theme.spacing.xs,
  },
  likedButton: {
    tintColor: theme.colors.desmosOrange01,
  },
  attachmentImageStyle: {
    width: 268,
    height: 178,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
  },
  contentText: {
    color: theme.colors.surfaceBlack,
    marginVertical: theme.spacing.m,
    paddingRight: theme.spacing.m,
  },
  bottomGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactionButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  interactionButtonGroup: {
    flexDirection: 'row',
    flex: 0.75,
  },
  loadingAnim: {
    width: 24,
    height: 24,
  },
}));

export default useStyles;
