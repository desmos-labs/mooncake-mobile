import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const GenerateAccount: React.FC<Props> = () => {
  const {t} = useTranslation('accountCreation');

  return (
    <DView>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <ThemedLottieView autoSize autoPlay loop source="broadcast-tx" />
        <Typography.H4>{t('transaction broadcasting')}</Typography.H4>
        <Typography.Body6>{t('please wait')}</Typography.Body6>
      </View>
    </DView>
  );
};

export default GenerateAccount;
