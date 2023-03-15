import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import { connectIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'native-base';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import { ApplicationLink, DesmosProfile } from 'types/desmos';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import useStyles from './useStyles';

interface EditProfileSectionProps {
  /**
   * Profile to be edited.
   */
  profile: DesmosProfile;
  appLinks: ApplicationLink[];
}

/**
 * Component that renders the profile section allowing to edit the details of the profile.
 * @constructor
 */
const EditProfileSection = (props: EditProfileSectionProps) => {
  const { t } = useTranslation('profile');
  const theme = useTheme();
  const styles = useStyles();
  const { navigate } = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const { profile, appLinks } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const saveProfile = useSaveProfile();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleSaveProfile = useCallback(() => {
    saveProfile({ profile });
  }, [profile, saveProfile]);

  const handleConnectionButtonPressed = useCallback(() => {
    navigate(ROUTES.MANAGE_CONNECTIONS_MODAL, {
      appLinks,
    });
  }, [appLinks, navigate]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
        <Typography.Subtitle4>{t('edit profile')}</Typography.Subtitle4>
      </TouchableOpacity>
      <TouchableOpacity style={styles.connectButton} onPress={handleConnectionButtonPressed}>
        <FastImage source={connectIcon} style={styles.icon} tintColor={theme.colors.surfaceBlack} />
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileSection;
