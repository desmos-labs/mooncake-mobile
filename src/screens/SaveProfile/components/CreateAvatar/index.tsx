import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { editProfilePic } from 'assets/images';
import ImageButton from 'components/ImageButton';

type Props = {
  avatar: ImageSourcePropType;

  handlePressEdit: () => void;
};

const CreateAvatar = ({ avatar, handlePressEdit }: Props) => {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={avatar} />

      <ImageButton
        onPress={handlePressEdit}
        image={editProfilePic}
        style={styles.editProfileButton}
      />
    </View>
  );
};

export default CreateAvatar;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    height: 100,
    resizeMode: 'cover',
    width: 100,
  },
  container: {
    alignSelf: 'center',
    bottom: -45,
    zIndex: 2,
  },
  editProfileButton: {
    bottom: -5,
    height: 35,
    position: 'absolute',
    resizeMode: 'contain',
    right: -5,
    width: 35,
  },
});
