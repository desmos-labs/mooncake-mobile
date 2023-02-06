import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useFetchProfile } from 'screens/SelectAccount/components/ProfileItem/useHooks';
import ProfileImage from 'components/ProfileImage';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

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
  }, [profile, profileLoading]);

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.07)',
        distance: 40,
        offset: [10, 20],
      }}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <ProfileImage style={styles.avatar} profile={profile} size={46} loading={profileLoading} />

        <View>
          {profile && <Typography.H5>{getProfileDisplayName(profile)}</Typography.H5>}

          <Typography.Body6 ellipsizeMode="middle" numberOfLines={1}>
            {address}
          </Typography.Body6>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
