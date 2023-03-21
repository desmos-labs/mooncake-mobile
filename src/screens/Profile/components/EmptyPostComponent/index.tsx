import { errorImage } from 'assets/images';
import Button from 'components/CustomButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from 'native-base';

export interface EmptyPostComponentProps {
  readonly textLabel: string;
  readonly buttonLabel: string;
}

/**
 * A component that displays an empty post.
 * @constructor
 */
const EmptyPostComponent = (props: EmptyPostComponentProps) => {
  const theme = useTheme();
  const { textLabel, buttonLabel } = props;

  return (
    <View style={{ flex: 1 }}>
      <Spacer paddingVertical={theme.spacing.m} />
      <Image
        style={{
          height: 140,
          resizeMode: 'contain',
          marginVertical: theme.spacing.m,
          alignSelf: 'center',
        }}
        source={errorImage}
      />
      <Typography.Body6 style={{ textAlign: 'center' }}>{textLabel}</Typography.Body6>
      <Spacer paddingVertical={theme.spacing.m} />
      <Button size={44} variant="outlined" mx={100} justifyContent="center">
        {buttonLabel}
      </Button>
    </View>
  );
};

export default EmptyPostComponent;
