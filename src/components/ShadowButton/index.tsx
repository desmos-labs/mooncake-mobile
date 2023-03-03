import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

type Props = {
  handlePress: () => void;
  buttonImage: ImageSourcePropType;
  buttonText: string;
};

/**
 * TouchableOpacity with a drop shadow wrapper
 * @param handlePress - function to call when the button is pressed
 * @param buttonImage - image to display on the button
 * @param buttonText - text to display on the button
 * @constructor
 */
const ShadowButton = ({ handlePress, buttonImage, buttonText }: Props) => {
  const styles = useStyles();

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.05)',
      }}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image style={styles.buttonImage} source={buttonImage} />
        <View>
          <Typography.Body5>{buttonText}</Typography.Body5>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ShadowButton;
