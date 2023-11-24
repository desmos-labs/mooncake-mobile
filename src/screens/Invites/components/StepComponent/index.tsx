import Typography from 'components/Typography';
import { Image, ImageSource } from 'expo-image';
import { HStack, useTheme, VStack } from 'native-base';
import React from 'react';
import { Trans } from 'react-i18next';
import { View } from 'react-native';
import useStyles from './useStyles';

interface Props {
  image: ImageSource;
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
        <Image source={image} style={styles.image} />
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
