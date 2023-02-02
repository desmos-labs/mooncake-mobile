import {errorImage} from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
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
      <Typography.Body6 style={{textAlign: 'center'}}>
        {textLabel}
      </Typography.Body6>
      <Spacer paddingVertical={theme.spacing.m} />
      <Button
        size={ButtonSize.M}
        mode={ButtonMode.OUTLINED}
        additionalStyle={{
          marginHorizontal: 100,
          justifyContent: 'center',
        }}>
        <Typography.Button1>{buttonLabel}</Typography.Button1>
      </Button>
    </View>
  );
};

export default EmptyPostComponent;
