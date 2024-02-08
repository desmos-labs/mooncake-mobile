import { editProfilePic } from 'assets/images';
import ImageButton from 'components/ImageButton';
import { Image } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

type Props = {
  avatar: ImageSourcePropType;

  handlePressEdit: () => void;
};

const CreateAvatar = ({ avatar, handlePressEdit }: Props) => {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={avatar} transition={250} />

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
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 2,
    position: 'absolute',
    top: 90,
    zIndex: 3,
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
