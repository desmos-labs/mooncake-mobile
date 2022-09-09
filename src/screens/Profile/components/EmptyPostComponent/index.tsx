import {errorImage} from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import {Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';

interface Props {
  textLabel: string;
  buttonLabel: string;
}

const EmptyPostComponent = ({textLabel, buttonLabel}: Props) => {
  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      <Spacer paddingVertical={theme.spacing.xl} />
      <Image
        style={{
          width: 335,
          height: 116,
          resizeMode: 'contain',
          marginVertical: theme.spacing.m,
          alignSelf: 'center',
        }}
        source={errorImage}
      />

      <Typography.Subtitle1 style={{textAlign: 'center'}}>
        {textLabel}
      </Typography.Subtitle1>
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
