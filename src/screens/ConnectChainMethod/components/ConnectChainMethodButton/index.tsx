import React from 'react';
import DropShadowWrapper from 'components/DropShadowWrapper';
import {Image, TouchableOpacity} from 'react-native';
import {useLedgerIcon, usePasswordIcon} from 'assets/images';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  method: 'ledger' | 'password';

  handlePress: () => void;
};

const ConnectChainMethodButton = ({method, handlePress}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation('connectChain');

  const buttonImage = React.useMemo(() => {
    const imageMap = {
      ledger: useLedgerIcon,
      password: usePasswordIcon,
    };

    return imageMap[method];
  }, [method]);

  const buttonText = React.useMemo(() => {
    const textMap = {
      ledger: t('connectWithLedger'),
      password: t('usePw'),
    };

    return textMap[method];
  }, [method]);

  return (
    <DropShadowWrapper customColor="rgba(37, 87, 188, 0.05)">
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image source={buttonImage} style={styles.buttonImage} />

        <Typography.H5 style={styles.textStyle}>{buttonText}</Typography.H5>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ConnectChainMethodButton;
