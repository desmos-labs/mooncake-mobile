import { makeStyleWithProps } from 'config/theme';
import { CommentItemProps } from 'screens/PostInteraction/PostComments/components/CommentItem/index';

/**
 * Style hook for the CommentItem component
 */
const useStyles = makeStyleWithProps((props: CommentItemProps, theme) => ({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.s,
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
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: theme.spacing.s,
  },
  textStyle: {
    color: theme.colors.neutral['700'],
  },
  subTextStyle: {
    color: theme.colors.grey02,
  },
  buttonImage: {
    width: 20,
    height: 20,
    tintColor: theme.colors.neutral['700'],
    resizeMode: 'contain',
  },
  interactionImage: {
    marginRight: theme.spacing.xs,
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
    flex: props.disableInnerComment ? 0.5 : 0.75,
  },
  loadingAnim: {
    width: 24,
    height: 24,
  },
  orangeText: {
    color: theme.colors.butterOrange01,
  },
  orangeIcon: {
    tintColor: theme.colors.butterOrange01,
  },
}));

export default useStyles;
