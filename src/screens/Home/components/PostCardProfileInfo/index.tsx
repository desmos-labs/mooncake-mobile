import { TouchableOpacity, View } from 'react-native';
import CommonStyles from 'config/theme/CommonStyles';
import FastImage from 'react-native-fast-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import { Center, HStack, useTheme, VStack } from 'native-base';
import Typography from 'components/Typography';
import React, { useEffect, useMemo } from 'react';
import { isPostPending, Post } from 'types/posts';
import ThemedLottieView from 'components/ThemedLottieView';
import { loadingYellow } from 'assets/animations';
import PopupMenu from 'components/PopupMenu';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { parseISO } from 'date-fns';
import { formatMsToHumanReadable } from 'lib/FormatUtils';
import { useTranslation } from 'react-i18next';
import { useActiveAccountAddress } from '@recoil/accounts';
import { block, followBlackIcon, reportIcon, unblock, unfollowBlackIcon } from "assets/images";
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useIsBlocked from 'hooks/relationships/blocked/useIsBlocked';
import useStyles from './useStyles';

export interface PostCardProfileInfoProps {
  readonly post: Post;
  readonly onPressAuthor: () => void;
  readonly onPressFollow: () => void;
  readonly onPressReport: () => void;
  readonly onPressBlock: () => void;
}

/**
 * Component that displays the profile info of a post.
 * @constructor
 */
const PostCardProfileInfo = (props: PostCardProfileInfoProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('home');

  const { post, onPressAuthor, onPressFollow, onPressBlock, onPressReport } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
  const formatDate = useFormatTimeForPostDetails();

  const { isFollowing, refetch: refreshFollowing } = useIsFollowing(post.author.address);

  const { isBlocked, refetch: refreshBlocked } = useIsBlocked(post.author.address);

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  // const [actualDate, setActualDate] = useState(new Date());

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    refreshFollowing();
    refreshBlocked();

    // It's fine to disable the following line because we want to run this effect only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Memoized variables
  // -------------------------------------------------------------------------------------

  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  const isPending = useMemo(() => isPostPending(post), [post]);

  const formattedDate = useMemo(
    () => formatDate(post.creationDate),
    [formatDate, post.creationDate],
  );

  // TODO: Replace this with https://day.js.org/docs/en/display/from-now
  const date = Date.now();
  const calculatedCreationDate = useMemo(() => {
    const parsedTime = parseISO(`${post.creationDate}Z`);
    const differenceInUnix = date - parsedTime.getTime();
    if (differenceInUnix < 0) {
      return t('now');
    } else if (differenceInUnix < 59999) {
      return t('seconds ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'seconds'),
      });
    } else if (differenceInUnix < 3599999) {
      return t('minutes ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'minutes'),
      });
    } else if (differenceInUnix < 86399999) {
      return t('hours ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'hours'),
      });
    } else if (differenceInUnix < 31556951999) {
      return t('days ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'days'),
      });
    } else {
      return formattedDate;
    }
  }, [date, formattedDate, post.creationDate, t]);

  const popupMenuItems = useMemo(
    () => [
      {
        label: isFollowing ? t('unfollow') : t('follow'),
        onPress: onPressFollow,
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      {
        label: t('report'),
        onPress: onPressReport,
        icon: reportIcon,
      },
      {
        label: isBlocked ? t('home:unblock') : t('home:block'),
        onPress: onPressBlock,
        icon: unblock,
      },
    ],
    [isFollowing, t, onPressFollow, onPressReport],
  );

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  const PendingIndicator = useMemo(() => {
    if (isPending) {
      return <ThemedLottieView source={loadingYellow} autoPlay style={styles.pendingIcon} />;
    } else if (!isCurrentUserAuthor) {
      return <PopupMenu menuItems={popupMenuItems} />;
    }
  }, [popupMenuItems, isPending, isCurrentUserAuthor, styles.pendingIcon]);

  return (
    <View style={styles.profileInfoView}>
      <TouchableOpacity style={CommonStyles.flexDirection.row} onPress={onPressAuthor}>
        <FastImage source={getProfilePicture(post.author)} style={styles.profilePic} />
        <VStack>
          <Typography.Subtitle2>{post.author.nickname}</Typography.Subtitle2>
          <HStack>
            <Typography.Body6 style={{ color: theme.colors.midGrey }}>
              @{post.author.dTag}
            </Typography.Body6>
            <Typography.Body6
              style={{
                color: theme.colors.midGrey,
                marginLeft: theme.spacing.xs,
              }}>
              {!isPending && `· ${calculatedCreationDate}`}
            </Typography.Body6>
          </HStack>
        </VStack>
      </TouchableOpacity>
      <Center justifyContent="flex-start">{PendingIndicator}</Center>
    </View>
  );
};

export default PostCardProfileInfo;
