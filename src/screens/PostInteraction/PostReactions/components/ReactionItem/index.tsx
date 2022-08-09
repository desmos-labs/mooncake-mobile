import React from 'react';
import {View, Image, ImageSourcePropType} from 'react-native';
import Typography from 'components/Typography';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  nickname: string;

  dTag: string;

  followed?: boolean;

  avatar: ImageSourcePropType;

  handlePressFollow: () => void;

  handlePressUnfollow: () => void;
};

const ReactionItem = ({
  nickname,
  dTag,
  followed,
  avatar,
  handlePressFollow,
  handlePressUnfollow,
}: Props) => {
  const styles = useStyles();

  const theme = useTheme();

  const {t} = useTranslation('postInteraction');

  return (
    <View style={styles.container}>
      <Image source={avatar} style={styles.avatarStyle} />
      <View style={styles.textGroup}>
        <View>
          <Typography.Subtitle3 style={styles.textStyle}>
            {nickname}
          </Typography.Subtitle3>
          <Typography.Body7 style={styles.subTextStyle}>
            @{dTag}
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
