import DropShadowWrapper from 'components/DropShadowWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Box } from 'native-base';
import SingleProperty from 'screens/NftDetails/components/SingleProperty';
import useStyles from './useStyles';

interface Props {
  nftData: any;
}

const PropertiesSection = (nftData: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('nft');

  useEffect(() => {
    console.log(nftData);
  }, []);

  return (
    <Box mt="m" flex={1}>
      <Typography.H5>{t('properties')}</Typography.H5>
      <Spacer paddingVertical={16}>
        <DropShadowWrapper
          outerShadowProps={{
            startColor: 'rgba(16, 24, 40, 0.03)',
            distance: 30,
          }}>
          <View style={styles.section}>
            <SingleProperty roundTop={true} header="Lorem ipsum" body="Lorem ipsum" number={10} />
            <SingleProperty header="A" body="Lorem ipsum" number={12} />
            <SingleProperty header="B" body="Lorem ipsum" number={65} />
            <SingleProperty header="C" body="Lorem ipsum" number={100} roundBottom={true} />
          </View>
        </DropShadowWrapper>
      </Spacer>
    </Box>
  );
};

export default PropertiesSection;
