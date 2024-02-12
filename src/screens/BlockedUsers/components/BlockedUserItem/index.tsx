import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import Button from 'components/Button';
import { Image } from 'expo-image';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useBlockOrUnblockUser from 'hooks/relationships/useBlockOrUnblockUser';
import { getProfilePicture } from 'lib/ProfileUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
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
  const navigateToProfile = useNavigateToProfile();

  const BlockOrUnblockButton = React.useMemo(() => {
    return (
      <Button
        height={32}
        onPress={() => {
          handleBlockOrUnblockUser(profile);
        }}>
        {profile.isBlockedByUser ? t('unblock') : t('block')}
      </Button>
    );
  }, [t, handleBlockOrUnblockUser, profile]);

  return (
    <TouchableOpacity onPress={() => navigateToProfile(profile.address)}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {/* Profile picture */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={getProfilePicture(profile)} style={styles.pic} />
          {/* Profile DTag and nickname */}
          <View
            style={{
              marginLeft: 4,
            }}>
            <Typography.Semibold14 numberOfLines={1} ellipsizeMode="tail">
              {profile.nickname}
            </Typography.Semibold14>
            <Typography.Regular12 style={styles.dTagStyle} numberOfLines={1} ellipsizeMode="tail">
              @{profile.dTag}
            </Typography.Regular12>
          </View>
        </View>
        {BlockOrUnblockButton}
      </View>
    </TouchableOpacity>
  );
};

export default BlockedUserItem;
