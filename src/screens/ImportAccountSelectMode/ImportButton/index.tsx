import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import useStyles from './useStyles';

type Props = {
  handlePress: () => void;
  buttonImage: Source;
  buttonText: string;
};

const ImportButton = ({ handlePress, buttonImage, buttonText }: Props) => {
  const styles = useStyles();

  return (
    <DropShadowWrapper
      outerShadowProps={{
        style: styles.shadow,
        startColor: 'rgba(37, 87, 188, 0.05)',
      }}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <FastImage style={styles.buttonImage} source={buttonImage} />
        <View>
          <Typography.Body5>{buttonText}</Typography.Body5>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ImportButton;
