import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import Button from 'components/Button';
import useNavigateToProfileEdit from 'hooks/navigation/useNavigateToProfileEdit';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
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
      <Button height={32} onPress={handleSaveProfile} style={styles.editButton}>
        <Typography.Regular14>{t('edit profile')}</Typography.Regular14>
      </Button>
    </View>
  );
};

export default EditProfileSection;
