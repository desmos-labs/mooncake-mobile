import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import { useActiveAccountAddress } from '@recoil/accounts';
import AvatarImage from 'components/AvatarImage';
import ToggleFollowageButton from 'components/ToggleFollowageButton';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
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
const SearchUsersResult = ({ profile }: Props) => {
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
      <AvatarImage imageSource={profile} size={48} />
      <View style={styles.textContainer}>
        <Typography.Semibold14>{profile.nickname || 'no-nickname'}</Typography.Semibold14>
        <Typography.Regular12 style={{ color: theme.colors.neutralVariants['700'] }}>
          @{profile.dTag}
        </Typography.Regular12>
      </View>
      <ToggleFollowageButton user={profile} buttonWidth={99} />
    </TouchableOpacity>
  );
};

export default SearchUsersResult;
