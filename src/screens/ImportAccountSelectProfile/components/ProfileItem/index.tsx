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

/**
 * Component that allows to render a single user item within a list.
 * @constructor
 */
const ProfileItem = (props: Props) => {
  const styles = useStyles();

  const { address, handlePress } = props;
  const { profile, profileLoading } = useFetchProfile(address, 250);

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
            <Typography.H6 ellipsizeMode="tail" numberOfLines={1}>
              {getProfileDisplayName(profile)}
            </Typography.H6>
          )}
          <Typography.Body7 ellipsizeMode="middle" numberOfLines={1} style={styles.address}>
            {address}
          </Typography.Body7>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
