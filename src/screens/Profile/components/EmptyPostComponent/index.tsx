import { errorImage } from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from 'react-native-paper';

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
      <Button
        mode="outlined"
        style={{
          borderColor: theme.colors.surfaceBlack,
          marginHorizontal: 100,
          height: 44,
          justifyContent: 'center',
        }}>
        <Typography.Button1>{buttonLabel}</Typography.Button1>
      </Button>
    </View>
  );
};

export default EmptyPostComponent;
