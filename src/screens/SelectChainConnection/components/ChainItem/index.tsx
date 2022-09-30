import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  chainName: string;

  symbol: string;

  icon: ImageSourcePropType;

  handlePress: () => void;
};

const ChainItem = ({chainName, symbol, icon, handlePress}: Props) => {
  const styles = useStyles();
  return (
    <DropShadowWrapper customColor="rgba(37, 87, 188, 0.05)">
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image source={icon} style={styles.iconStyle} />
        <View style={styles.textGroup}>
          <Typography.H5>{symbol}</Typography.H5>
          <Typography.Body7>{chainName}</Typography.Body7>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ChainItem;
