import React from 'react';
import {Image, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import {
  desmosIcon,
  disconnectIcon,
  dummyAvatar,
  modalSuccess,
} from 'assets/images';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChainLink} from 'types/link';
import LinkableChains from 'config/LinkableChains';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.DISCONNECT_CHAIN_MODAL
>;

export type DisconnectChainParams = {
  chainLink: ChainLink;
};

const DisconnectChainModal = () => {
  const styles = useStyles();

  const {goBack, navigate, pop} = useNavigation<NavProps['navigation']>();

  const {
    params: {chainLink},
  } = useRoute<NavProps['route']>();

  const {t} = useTranslation('disconnectChain');

  const chain = React.useMemo(() => {
    return LinkableChains.find(x => x.name === chainLink.chainName);
  }, [chainLink]);

  const handlePressYes = React.useCallback(() => {
    // Placeholder success modal
    navigate(ROUTES.RESULT_MODAL, {
      image: modalSuccess,
      title: t('resultModal:success'),
      subtitle: t('resultModal:yourChainLinkDisconnected', {
        chainLink: chain!.name,
      }),
      primaryButtonLabel: t('resultModal:goToProfile') as string,
      onPressPrimary: () => {
        // Remove result modal and this modal from stack
        pop(2);
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Typography.H5 style={styles.textStyle}>
          {t('disconnect')}
        </Typography.H5>

        <View style={styles.chainImageGroup}>
          <Image
            source={chain ? chain.icon : dummyAvatar}
            style={styles.chainIcon}
          />
          <Image source={disconnectIcon} style={styles.disconnectIcon} />
          <Image source={desmosIcon} style={styles.chainIcon} />
        </View>

        <Typography.Body5 style={styles.textStyle}>
          {t('areYouSure')}
        </Typography.Body5>
        <Typography.Button2 style={styles.textStyle}>
          {chainLink.externalAddress}
        </Typography.Button2>

        <Button
          containerStyle={styles.confirmButton}
          mode="gradientFilled"
          onPress={handlePressYes}>
          {t('common:yes')}
        </Button>

        <Button mode="outlined" onPress={goBack}>
          {t('common:no')}
        </Button>
      </View>
    </View>
  );
};

export default DisconnectChainModal;
