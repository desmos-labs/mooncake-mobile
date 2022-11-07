import {defaultProfilePic} from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
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
    <DropShadowWrapper>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <FastImage
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
