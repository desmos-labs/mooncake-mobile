import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import DropShadowWrapper from 'components/DropShadowWrapper';
import useStyles from './useStyles';

type Props = {
  nickname: string;

  dtag: string;

  avatar: ImageSourcePropType;

  handlePress: () => void;
};

const ProfileItem = ({nickname, dtag, handlePress, avatar}: Props) => {
  const styles = useStyles();

  return (
    <DropShadowWrapper customColor="rgba(16, 24, 40,0.05)" disableInnerWrapper>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image source={avatar} style={styles.avatar} />

        <View>
          <Typography.H5>{nickname}</Typography.H5>

          <Typography.Body6>@{dtag}</Typography.Body6>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
