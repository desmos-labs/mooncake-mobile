import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import { LedgerApp } from 'types/ledger';
import useStyles from './useStyles';

type Props = {
  app: LedgerApp;
  handlePress: () => void;
};

const ChainItem = ({ app, handlePress }: Props) => {
  const styles = useStyles();
  return (
    <DropShadowWrapper customColor="rgba(37, 87, 188, 0.05)">
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image source={app.icon} style={styles.iconStyle} />
        <View style={styles.textGroup}>
          <Typography.H5>{app.name}</Typography.H5>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ChainItem;
