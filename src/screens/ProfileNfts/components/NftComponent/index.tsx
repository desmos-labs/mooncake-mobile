import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import { Box } from 'native-base';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createImageProgress } from 'react-native-image-progress';
import useStyles from './useStyles';

export interface Props {
  data: any;
  onPress: () => void;
}

const NftComponent = ({ data, onPress }: Props) => {
  const styles = useStyles();
  const Image = createImageProgress(Image);
  return (
    <Box flex={1} m="s">
      <DropShadowWrapper
        customDistance={8}
        outerShadowProps={{ startColor: 'rgba(16, 24, 40, 0.03)', distance: 30 }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
          <Image source={{ uri: data.image }} style={styles.image} imageStyle={styles.image} />
          <View style={styles.textGroup}>
            <Typography.Subtitle4 numberOfLines={1}>{data.name}</Typography.Subtitle4>
            <Typography.Body7>#{data.tokenId}</Typography.Body7>
          </View>
        </TouchableOpacity>
      </DropShadowWrapper>
    </Box>
  );
};

export default NftComponent;
