import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Image from 'react-native-image-progress';
import useStyles from './useStyles';

export interface Props {
  data: any;
  onPress: () => void;
}

const NftComponent = ({data, onPress}: Props) => {
  const styles = useStyles();
  return (
    <View style={{flex: 1}}>
      <DropShadowWrapper
        style={{margin: 6}}
        customColor="rgba(133, 133, 133, 0.001)"
        customDistance={8}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
          <Image
            source={{uri: data.image}}
            style={styles.image}
            imageStyle={styles.innerStyle}
          />
          <View style={styles.textGroup}>
            <Typography.Subtitle4 numberOfLines={1}>
              {data.name}
            </Typography.Subtitle4>
            <Typography.Body7>#{data.tokenId}</Typography.Body7>
          </View>
        </TouchableOpacity>
      </DropShadowWrapper>
    </View>
  );
};

export default NftComponent;
