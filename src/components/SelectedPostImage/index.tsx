import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageProps, TouchableOpacity, View } from 'react-native';
import { makeStyle } from 'config/theme';
import { UploadAssetType } from 'services/axios/requests/UploadMedia';
import { deleteButton } from 'assets/images';
import { scale } from 'react-native-size-matters';

interface Props extends Omit<ImageProps, 'style' | 'source'> {
  source: UploadAssetType | undefined;
  handlePress: (source: UploadAssetType) => void;
  dimensions?: {
    width?: number;
    height?: number;
  };
}

/**
 * Component that represents a single image that was selected to be added to a comment.
 * @constructor
 */
const SelectedPostImage = ({ source, handlePress, dimensions }: Props) => {
  const styles = useStyles();
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const screenDimensions = Dimensions.get('window');

  // Calculate the width and height of the image based on the screen dimensions
  // and the dimensions of the image
  useEffect(() => {
    if (dimensions?.height && dimensions?.width) {
      if (dimensions.height > dimensions.width) {
        const ratio = screenDimensions.height / 2.5 / dimensions.height;
        setImageHeight(screenDimensions.height / 2.5);
        setImageWidth(dimensions.width * ratio);
      } else if (dimensions.height === dimensions.width) {
        const ratio = screenDimensions.height / 4 / dimensions.height;
        setImageHeight(dimensions.width * ratio);
        setImageWidth(dimensions.width * ratio);
      } else {
        const ratio = (screenDimensions.width - 32) / dimensions.width;
        setImageHeight(dimensions.height * ratio);
        setImageWidth(screenDimensions.width - 32);
      }
    }
  }, [dimensions?.height, dimensions?.width, screenDimensions.height, screenDimensions.width]);

  return (
    <View>
      {/* Invisible view acts as a placeholder, otherwise the component will appear */}
      {/* underneath the keyboard if an image is selected while the keyboard is expanded */}
      {!source ? (
        <View style={styles.fakeView} />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              width: imageWidth,
              height: imageHeight,
            }}>
            <Image
              style={[
                {
                  width: imageWidth,
                  height: imageHeight,
                },
                styles.image,
              ]}
              resizeMode="contain"
              source={source}
            />
            <TouchableOpacity
              style={styles.closeButtonContainer}
              onPress={() => handlePress(source)}>
              <Image style={styles.closeButton} source={deleteButton} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  fakeView: { opacity: 0 },
  closeButton: {
    height: scale(24),
    width: scale(24),
    resizeMode: 'contain',
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  image: {
    backgroundColor: theme.colors.grey01,
    borderRadius: 12,
  },
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    borderRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

export default SelectedPostImage;
