import { TouchableOpacity, View } from 'react-native';
import CommonStyles from 'config/theme/CommonStyles';
import FastImage from 'react-native-fast-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import { Center, HStack, useTheme, VStack } from 'native-base';
import Typography from 'components/Typography';
import React, { useEffect, useMemo, useState } from 'react';
import { isPostPending, Post } from 'types/posts';
import ThemedLottieView from 'components/ThemedLottieView';
import { loadingOrange } from 'assets/animations';
import PopupMenu from 'components/PopupMenu';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { parseISO } from 'date-fns';
import { formatMsToHumanReadable } from 'lib/FormatUtils';
import { useTranslation } from 'react-i18next';
import { useActiveAccountAddress } from '@recoil/accounts';
import { followBlackIcon, reportIcon, unfollowBlackIcon } from 'assets/images';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useStyles from './useStyles';

export interface PostCardProfileInfoProps {
  readonly post: Post;
  readonly onPressAuthor: () => void;
  readonly onPressFollow: () => void;
  readonly onPressReport: () => void;
}

/**
 * Component that displays the profile info of a post.
 * @constructor
 */
const PostCardProfileInfo = (props: PostCardProfileInfoProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('home');

  const { post, onPressAuthor, onPressFollow, onPressReport } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
  const formatDate = useFormatTimeForPostDetails();

  const isFollowing = useIsFollowing(post.author.address);
  const [actualDate, setActualDate] = useState(new Date());

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActualDate(new Date());
    }, 60000);
    return () => clearInterval(intervalId);
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
  const calculatedCreationDate = useMemo(() => {
    const parsedTime = parseISO(`${post.creationDate}Z`);

    const differenceInUnix = actualDate.getTime() - parsedTime.getTime();
    if (differenceInUnix < 59999) {
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
  }, [actualDate, formattedDate, post.creationDate, t]);

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
    ],
    [isFollowing, t, onPressFollow, onPressReport],
  );

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  const PendingIndicator = useMemo(() => {
    if (isPending) {
      return <ThemedLottieView source={loadingOrange} autoPlay style={styles.pendingIcon} />;
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
