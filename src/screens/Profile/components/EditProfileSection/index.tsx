import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import { connectIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import { ApplicationLink, ChainLink, DesmosProfile } from 'types/desmos';
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
  chainLinks: ChainLink[];
  appLinks: ApplicationLink[];
}

/**
 * Component that renders the profile section allowing to edit the details of the profile.
 * @constructor
 */
const EditProfileSection = (props: EditProfileSectionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const { navigate } = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const { profile, chainLinks, appLinks } = props;

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
      chainLinks,
    });
  }, [appLinks, chainLinks, navigate]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
        <Typography.Subtitle4>{t('edit profile')}</Typography.Subtitle4>
      </TouchableOpacity>
      <TouchableOpacity style={styles.connectButton} onPress={handleConnectionButtonPressed}>
        <FastImage
          source={connectIcon}
          style={{ height: 22, width: 22 }}
          tintColor={theme.colors.surfaceBlack}
        />
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileSection;
