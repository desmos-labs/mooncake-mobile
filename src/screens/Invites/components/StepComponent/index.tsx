import Typography from 'components/Typography';
import React from 'react';
import {Trans} from 'react-i18next';
import {View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';

interface Props {
  image: Source;
  number: number;
  text: string;
  disableLine?: boolean;
}

const StepComponent = ({image, number, text, disableLine}: Props) => {
  const theme = useTheme();

  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <FastImage source={image} style={{height: 32, width: 32}} />
        {!disableLine && (
          <View
            style={{
              marginVertical: theme.spacing.s,
              height: 16,
              width: 1.5,
              backgroundColor: theme.colors.butterOrange03,
            }}
          />
        )}
      </View>
      <View
        style={{
          height: 32,
          flexDirection: 'row',
          alignItems: 'flex-start',
          alignContent: 'center',
        }}>
        <Typography.Subtitle2 style={{marginHorizontal: theme.spacing.m}}>
          {number}
        </Typography.Subtitle2>
        <Typography.Body5>
          <Trans i18nKey={text} components={[<Typography.Subtitle2 />]} />
        </Typography.Body5>
      </View>
    </View>
  );
};

export default StepComponent;
