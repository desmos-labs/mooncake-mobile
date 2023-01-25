import Button from 'components/Button';
import Typography from 'components/Typography';
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
          color={theme.colors.surfaceBlack}
          style={styles.followButton}>
          <Typography.Button3
            style={{
              alignSelf: 'center',
            }}>
            {t('followingAndFollowers:unfollow')}
          </Typography.Button3>
        </Button>
      ) : (
        <Button
          onPress={handleButtonPress}
          mode="contained"
          color={theme.colors.butterOrange01}
          style={styles.followButton}>
          <Typography.Button3
            style={{color: theme.colors.white, alignSelf: 'center'}}>
            {t('followingAndFollowers:follow')}
          </Typography.Button3>
        </Button>
      )}
    </View>
  );
};

export default NotificationButton;
