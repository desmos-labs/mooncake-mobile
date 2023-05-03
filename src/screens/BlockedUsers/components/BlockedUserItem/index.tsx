import React from 'react';
import { DesmosProfile } from 'types/desmos';
import useIsBlocked from 'hooks/relationships/blocked/useIsBlocked';
import useBlockOrUnblockUser from 'hooks/relationships/blocked/useBlockOrUnblockUser';
import { HStack, VStack } from 'native-base';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import useStyles from './useStyles';

interface Props {
  /**
   * The blocked user data.
   */
  readonly profile: DesmosProfile;
}

const BlockedUserItem = ({ profile }: Props) => {
  const { t } = useTranslation('blockedUsers');
  const styles = useStyles();

  const handleBlockOrUnblockUser = useBlockOrUnblockUser();
  const { isBlocked } = useIsBlocked(profile.address);

  const BlockOrUnblockButton = React.useMemo(() => {
    return (
      <Button
        mt="s"
        backgroundColor={isBlocked ? 'surfaceBlack' : 'surfaceGrey'}
        textColor={isBlocked ? 'white' : 'surfaceBlack'}
        minWidth="80px"
        size={32}
        onPress={() => {
          handleBlockOrUnblockUser(profile);
        }}>
        {isBlocked ? t('unblock') : t('block')}
      </Button>
    );
  }, [isBlocked, t, handleBlockOrUnblockUser, profile]);

  return (
    <HStack px="m" alignItems="center" justifyContent="space-between">
      {/* Profile picture */}
      <HStack alignItems="center">
        <FastImage source={getProfilePicture(profile)} style={styles.pic} />

        {/* Profile DTag and nickname */}
        <VStack ml="s">
          <Typography.Subtitle3 numberOfLines={1} ellipsizeMode="tail">
            {profile.nickname}
          </Typography.Subtitle3>
          <Typography.Body7 style={styles.dTagStyle} numberOfLines={1} ellipsizeMode="tail">
            @{profile.dTag}
          </Typography.Body7>
        </VStack>
      </HStack>

      {BlockOrUnblockButton}
      {/* Button to follow or unfollow a user */}
    </HStack>
  );
};

export default BlockedUserItem;
