import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import useNavigateToProfileEdit from 'hooks/navigation/useNavigateToProfileEdit';
import { DesmosProfile } from 'types/desmos';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import Button from 'components/Button';
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

  const saveProfile = useNavigateToProfileEdit();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleSaveProfile = useCallback(() => {
    saveProfile({
      profile,
      onProfileSaved: returnToCurrentScreen,
    });
  }, [profile, returnToCurrentScreen, saveProfile]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Button size={32} flex={1} backgroundColor="surfaceGrey" onPress={handleSaveProfile}>
        {t('edit profile')}
      </Button>
    </View>
  );
};

export default EditProfileSection;
