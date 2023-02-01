import Button from 'components/Button';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

interface Props {
  handleButtonPress: () => void;
  isFollowingAddress: boolean;
}

const NotificationButton = ({handleButtonPress, isFollowingAddress}: Props) => {
  const theme = useTheme();
  const styles = useStyles();
  const {t} = useTranslation('activities');
  return (
    <View style={styles.buttonView}>
      {isFollowingAddress ? (
        <Button
          onPress={handleButtonPress}
          mode="outlined"
          size={32}
          additionalStyle={styles.followButton}>
          {t('followingAndFollowers:unfollow')}
        </Button>
      ) : (
        <Button
          onPress={handleButtonPress}
          mode="contained"
          size={32}
          textColor={theme.colors.white}
          backgroundColor={theme.colors.butterOrange01}
          additionalStyle={styles.followButton}>
          {t('followingAndFollowers:follow')}
        </Button>
      )}
    </View>
  );
};

export default NotificationButton;
