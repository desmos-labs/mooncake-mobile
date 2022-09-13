import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import DropShadowWrapper from 'components/DropShadowWrapper';
import {useTranslation} from 'react-i18next';
import {defaultProfilePic} from 'assets/images';
import useStyles from './useStyles';

type Props = {
  /**
   * The profile's nickname.
   */
  nickname: string;

  /**
   * The profile's dtag.
   */
  dtag: string;

  /**
   * The avatar's profile picture.
   */
  avatar: ImageSourcePropType;

  /**
   * What to do when the ProfileItem is pressed.
   */
  handlePress: () => void;
};

const ProfileItem = ({nickname, dtag, handlePress, avatar}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation('selectDtag');

  return (
    <DropShadowWrapper customColor="rgba(16, 24, 40,0.05)" disableInnerWrapper>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image
          source={
            // @ts-ignore
            !avatar || avatar!.uri === '[do-not-modify]'
              ? defaultProfilePic
              : avatar
          }
          style={styles.avatar}
        />
        <View>
          <Typography.H5>{nickname || t('noNickname')}</Typography.H5>

          <Typography.Body6>@{dtag}</Typography.Body6>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
