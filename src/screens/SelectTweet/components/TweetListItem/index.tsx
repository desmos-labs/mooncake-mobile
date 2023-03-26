import { twitterIcon } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { HStack, useTheme, VStack } from 'native-base';
import { TwitterTweet, TwitterUser } from 'types/twitter';
import useStyles from './useStyles';

export interface TweetListItemProps {
  readonly tweet: TwitterTweet;
  readonly user: TwitterUser;
  readonly selected: boolean;
  readonly onPress: (tweet: TwitterTweet) => void;
}

/**
 * Component that allows to display a single Tweet into a list.
 * @constructor
 */
const TweetListItem = (props: TweetListItemProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const { tweet, user, selected, onPress } = props;

  const formatTime = useFormatTimeForPostDetails();
  const formattedDate = formatTime(tweet.createdAt);

  return (
    <DropShadowWrapper
      style={styles.container}
      outerShadowProps={{ startColor: 'rgba(16, 24, 40, 0.03)', distance: 30 }}>
      <TouchableOpacity
        onPress={() => onPress(tweet)}
        style={[
          {
            padding: theme.spacing.m,
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.white,
          },
          selected && { backgroundColor: theme.colors.butterOrange05 },
        ]}>
        <HStack alignItems="center">
          <Image source={{ uri: user.profileImageUrl }} style={styles.profilePic} />
          <VStack justifyContent="center" ml="m">
            <Typography.Subtitle3>{user?.name}</Typography.Subtitle3>
            <Typography.Body7>@{user?.username}</Typography.Body7>
          </VStack>
          <Image source={twitterIcon} style={styles.image} />
        </HStack>
        <Spacer paddingBottom={theme.spacing.m} />
        <Typography.Body6>{tweet.text}</Typography.Body6>
        <Spacer paddingVertical={theme.spacing.s} />
        <Typography.Caption3 style={{ color: theme.colors.grey02 }}>
          {formattedDate}
        </Typography.Caption3>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default TweetListItem;
