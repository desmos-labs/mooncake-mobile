import { useActiveAccountAddress } from '@recoil/accounts';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import { getProfilePicture } from 'lib/ProfileUtils';
import { useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

interface Props {
  profile: DesmosProfile;
}

/**
 * Component that renders a single search result.
 * @param profile The profile to render.
 * @constructor
 */
const SearchResultComponent = ({ profile }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const activeAddress = useActiveAccountAddress();
  const navigateToProfile = useNavigateToProfile();
  const isActiveAddress = useMemo(
    () => profile.address === activeAddress,
    [activeAddress, profile.address],
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigateToProfile(isActiveAddress ? undefined : profile.address)}>
      <Image source={getProfilePicture(profile)} contentFit="cover" style={styles.avatar} />
      <View style={styles.textContainer}>
        <Typography.Subtitle3>{profile.nickname || 'no-nickname'}</Typography.Subtitle3>
        <Typography.Body7 style={{ color: theme.colors.midGrey }}>@{profile.dTag}</Typography.Body7>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultComponent;
