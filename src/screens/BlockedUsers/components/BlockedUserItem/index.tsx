import Button from 'components/Button';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useBlockOrUnblockUser from 'hooks/relationships/useBlockOrUnblockUser';
import useIsBlocked from 'hooks/relationships/useIsBlocked';
import { getProfilePicture } from 'lib/ProfileUtils';
import { HStack, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

interface Props {
  /**
   * The blocked user data.
   */
  readonly profile: DesmosProfile;
}

const BlockedUserItem = ({ profile }: Props) => {
  const { t } = useTranslation('relationships');
  const styles = useStyles();

  const handleBlockOrUnblockUser = useBlockOrUnblockUser();
  const { isBlocked, refetch: refreshBlockedCacheForUser } = useIsBlocked(profile.address);
  const navigateToProfile = useNavigateToProfile();

  useEffect(() => {
    refreshBlockedCacheForUser();
    // safe to ignore as we only want to run the effect once
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

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
    <TouchableOpacity onPress={() => navigateToProfile(profile.address)}>
      <HStack px="m" alignItems="center" justifyContent="space-between">
        {/* Profile picture */}
        <HStack alignItems="center">
          <Image source={getProfilePicture(profile)} style={styles.pic} />
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
      </HStack>
    </TouchableOpacity>
  );
};

export default BlockedUserItem;
