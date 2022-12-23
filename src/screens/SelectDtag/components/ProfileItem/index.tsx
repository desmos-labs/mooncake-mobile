import {defaultProfilePic} from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
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
const Image = createImageProgress(FastImage);

const ProfileItem = ({nickname, dtag, handlePress, avatar}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation('selectDtag');

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.07)',
        distance: 40,
        offset: [10, 20],
      }}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image
          resizeMode="cover"
          source={
            // @ts-ignore
            !avatar || avatar!.uri === '[do-not-modify]'
              ? defaultProfilePic
              : avatar
          }
          imageStyle={{borderRadius: 23}}
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
