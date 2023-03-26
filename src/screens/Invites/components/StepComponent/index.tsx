import Typography from 'components/Typography';
import React from 'react';
import { Trans } from 'react-i18next';
import { View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { HStack, useTheme, VStack } from 'native-base';
import useStyles from './useStyles';

interface Props {
  image: Source;
  number: number;
  text: string;
  disableLine?: boolean;
}

const StepComponent = ({ image, number, text, disableLine }: Props) => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <HStack>
      <VStack alignItems="center">
        <FastImage source={image} style={styles.image} />
        {!disableLine && <View style={styles.disabledContainer} />}
      </VStack>
      <View style={styles.container}>
        <Typography.Subtitle2 style={{ marginHorizontal: theme.spacing.m }}>
          {number}
        </Typography.Subtitle2>
        <Typography.Body5>
          <Trans i18nKey={text} components={[<Typography.Subtitle2 />]} />
        </Typography.Body5>
      </View>
    </HStack>
  );
};

export default StepComponent;
