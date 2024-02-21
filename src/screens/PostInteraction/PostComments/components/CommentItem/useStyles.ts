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
    paddingHorizontal: theme.spacings.s,
    paddingTop: theme.spacings.s,
    paddingBottom: theme.spacings.l,
    gap: theme.spacings.s,
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
    marginRight: theme.spacings.s,
  },
  textStyle: {
    color: theme.colors.neutralVariants['900'],
  },
  subTextStyle: {
    color: theme.colors.neutralVariants['700'],
  },
  dateTextStyle: {
    color: theme.colors.neutralVariants['600'],
  },
  buttonImage: {
    width: 24,
    height: 24,
    tintColor: theme.colors.neutralVariants['700'],
    resizeMode: 'contain',
  },
  interactionImage: {
    marginRight: theme.spacings.xs,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacings.s,
  },
  bottomGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacings.s,
  },
  interactionButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  interactionButtonGroup: {
    flexDirection: 'row',
    flex: 0.55,
  },
  loadingAnim: {
    width: 24,
    height: 24,
  },
  orangeText: {
    color: theme.colors.primary,
  },
  orangeIcon: {
    tintColor: theme.colors.primary,
  },
}));

export default useStyles;
