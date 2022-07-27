import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const BroadcastTx: React.FC<Props> = () => {
  const {t} = useTranslation('accountCreation');
  const styles = useStyles();

  return (
    <DView>
      <View style={styles.container}>
        <ThemedLottieView autoSize autoPlay loop source="broadcast-tx" />
        <Typography.H4>{t('transaction broadcasting')}</Typography.H4>
        <Typography.Body6>{t('please wait')}</Typography.Body6>
      </View>
    </DView>
  );
};

export default BroadcastTx;
