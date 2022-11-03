import {isFollowingAddr} from '@recoil/following';
import Button from 'components/Button';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import useStyles from './useStyles';

interface Props {
  type: string;
  action: string;
  post_id?: string;
  timestamp: string;
  profile?: any;
  relationship_creator?: string;
  post?: any;
}

const Activities = ({
  type,
  action,
  post_id,
  profile,
  timestamp,
  relationship_creator,
  post,
}: Props) => {
  const {t} = useTranslation('activities');
  const theme = useTheme();
  const styles = useStyles();
  const formattedDate = useFormatTimeForPostDetails(timestamp);
  const isFollowingAddress = useRecoilValue(
    isFollowingAddr(relationship_creator || ''),
  );
  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const content = useMemo(() => {
    switch (type) {
      case 'reaction':
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('liked')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            {post.attachments[0] && (
              <Image
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      case 'comment':
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('commented')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            {post.attachments[0] && (
              <Image
                style={styles.postImage}
                source={{uri: post.attachments[0].content.uri}}
              />
            )}
          </View>
        );
      case 'follow':
        return (
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.avatar} source={{uri: profile.profile_pic}} />
            <View style={styles.profileView}>
              <Typography.Subtitle3>
                {profile.nickname.trimStart()}
                <Typography.Body6> {t('followed you')}</Typography.Body6>
              </Typography.Subtitle3>
              <Typography.Body7 style={{color: theme.colors.grey02}}>
                {formattedDate}
              </Typography.Body7>
            </View>
            <View style={styles.buttonView}>
              {isFollowingAddress ? (
                <Button
                  onPress={() =>
                    followOrUnfollowUser({addrToFollow: relationship_creator!})
                  }
                  mode="outlined"
                  color={theme.colors.surfaceBlack}
                  style={styles.followButton}>
                  <Typography.Button3
                    style={{
                      alignSelf: 'center',
                    }}>
                    {t('followingAndFollowers:unfollow')}
                  </Typography.Button3>
                </Button>
              ) : (
                <Button
                  onPress={() =>
                    followOrUnfollowUser({addrToFollow: relationship_creator!})
                  }
                  mode="contained"
                  color={theme.colors.butterOrange01}
                  style={styles.followButton}>
                  <Typography.Button3
                    style={{color: theme.colors.white, alignSelf: 'center'}}>
                    {t('followingAndFollowers:follow')}
                  </Typography.Button3>
                </Button>
              )}
            </View>
          </View>
        );
      default:
        return <View />;
    }
  }, [
    action,
    formattedDate,
    post_id,
    profile.nickname,
    profile.profile_pic,
    type,
    followOrUnfollowUser,
    isFollowingAddress,
  ]);

  return (
    <TouchableOpacity style={styles.container}>{content}</TouchableOpacity>
  );
};

export default Activities;
