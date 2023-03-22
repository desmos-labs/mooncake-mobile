import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import { DesmosProfile } from 'types/desmos';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import useStyles from './useStyles';

interface EditProfileSectionProps {
  /**
   * Profile to be edited.
   */
  profile: DesmosProfile;
}

/**
 * Component that renders the profile section allowing to edit the details of the profile.
 * @constructor
 */
const EditProfileSection = (props: EditProfileSectionProps) => {
  const { t } = useTranslation('profile');
  const styles = useStyles();

  const { profile } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const saveProfile = useSaveProfile();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleSaveProfile = useCallback(() => {
    saveProfile({
      profile,
      onSuccess: returnToCurrentScreen,
    });
  }, [profile, returnToCurrentScreen, saveProfile]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
        <Typography.Subtitle4>{t('edit profile')}</Typography.Subtitle4>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileSection;
