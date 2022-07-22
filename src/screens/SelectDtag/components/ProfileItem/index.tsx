import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import DropShadowWrapper from 'components/DropShadowWrapper';
import {useTranslation} from 'react-i18next';
import useStyles from './useStyles';

type Props = {
  nickname: string;

  dtag: string;

  avatar: ImageSourcePropType;

  handlePress: () => void;
};

const ProfileItem = ({nickname, dtag, handlePress, avatar}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation('selectDtag');

  return (
    <DropShadowWrapper customColor="rgba(16, 24, 40,0.05)" disableInnerWrapper>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        {/* this is ok as we can be certain that all avatars will be from a uri */}
        {/* source */}
        {/* @ts-ignore */}
        {avatar && avatar?.uri ? (
          <Image source={avatar} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, {backgroundColor: 'gray'}]} />
        )}

        <View>
          <Typography.H5>{nickname || t('noNickname')}</Typography.H5>

          <Typography.Body6>@{dtag}</Typography.Body6>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
