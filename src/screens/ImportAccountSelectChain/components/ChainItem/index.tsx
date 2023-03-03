import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import { SupportedChain } from 'types/chains';
import useStyles from './useStyles';

type Props = {
  chain: SupportedChain;
  handlePress: () => void;
};

const ChainItem = ({ chain, handlePress }: Props) => {
  const styles = useStyles();
  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.07)',
        distance: 40,
        offset: [10, 20],
      }}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image source={chain.icon} style={styles.iconStyle} />
        <View style={styles.textGroup}>
          <Typography.H5>{chain.name}</Typography.H5>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ChainItem;
