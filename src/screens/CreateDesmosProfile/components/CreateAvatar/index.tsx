import React from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import {editProfilePic} from 'assets/images';
import ImageButton from 'components/ImageButton';

type Props = {
  avatar: ImageSourcePropType;

  handlePressEdit: () => void;
};

const CreateAvatar = ({avatar, handlePressEdit}: Props) => {
  return (
    <View style={{alignSelf: 'center', zIndex: 2, bottom: -45}}>
      <Image
        style={{
          resizeMode: 'cover',
          height: 100,
          width: 100,
          borderRadius: 50,
        }}
        source={avatar}
      />

      <ImageButton
        onPress={handlePressEdit}
        image={editProfilePic}
        style={{
          width: 35,
          height: 35,
          position: 'absolute',
          bottom: -5,
          right: -5,
        }}
      />
    </View>
  );
};

export default CreateAvatar;
