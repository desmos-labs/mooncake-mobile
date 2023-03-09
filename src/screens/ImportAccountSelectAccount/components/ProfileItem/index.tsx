import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { DesmosProfile } from 'types/desmos';
import { useFetchProfile } from './hooks';
import useStyles from './useStyles';
import ProfileImage from '../ProfileImage';

type Props = {
  address: string;
  /**
   * What to do when the ProfileItem is pressed.
   */
  handlePress: (profile: DesmosProfile | undefined) => void;
};

const ProfileItem = ({ address, handlePress }: Props) => {
  const styles = useStyles();
  const { profile, profileLoading } = useFetchProfile(address, 1000);

  const onPress = React.useCallback(() => {
    if (!profileLoading) {
      handlePress(profile);
    }
  }, [handlePress, profile, profileLoading]);

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.05)',
      }}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <ProfileImage style={styles.avatar} profile={profile} size={46} loading={profileLoading} />
        <View>
          {profile && (
            <Typography.H5 ellipsizeMode="tail" numberOfLines={1}>
              {getProfileDisplayName(profile)}
            </Typography.H5>
          )}
          <Typography.Body6 ellipsizeMode="middle" numberOfLines={1} style={styles.address}>
            {address}
          </Typography.Body6>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
