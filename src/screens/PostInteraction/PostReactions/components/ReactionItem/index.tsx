import {defaultProfilePic} from 'assets/images';
import Button from 'components/Button';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  reaction: {
    value: any;
    author: any;
  };
  handlePressFollow: () => void;
  handlePressUnfollow: () => void;
};

const ReactionItem = ({
  handlePressFollow,
  handlePressUnfollow,
  reaction,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postInteraction');
  const followed = true;

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <Image
        source={
          reaction.author.profile_pic
            ? {uri: reaction.author.profile_pic}
            : defaultProfilePic
        }
        style={styles.avatarStyle}
      />
      <View style={styles.textGroup}>
        <View>
          <Typography.Subtitle3 style={styles.textStyle}>
            {reaction.author.nickname
              ? reaction.author.nickname
              : t('common:no nickname')}
          </Typography.Subtitle3>
          <Typography.Body7 style={styles.subTextStyle}>
            @{reaction.author.dtag}
          </Typography.Body7>
        </View>
      </View>

      {followed ? (
        <Button
          style={styles.buttonContainer}
          mode="outlined"
          color={theme.colors.desmosOrange01}
          onPress={handlePressUnfollow}>
          <Typography.Button3 style={styles.unfollowText}>
            {t('unfollow')}
          </Typography.Button3>
        </Button>
      ) : (
        <Button
          containerStyle={styles.buttonContainer}
          mode="gradientFilled"
          onPress={handlePressFollow}>
          <Typography.Button3 style={styles.followText}>
            {t('follow')}
          </Typography.Button3>
        </Button>
      )}
    </View>
  );
};

export default ReactionItem;
