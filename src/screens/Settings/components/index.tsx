import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
import {RadioButtonInput} from 'react-native-simple-radio-button';
import useStyles from './useStyles';

export interface RadioValue {
  nickname: string;
  dTag: string;
  profilePicture: ImageSourcePropType;
  status: 0 | 1;
}

interface Props {
  values: RadioValue[];
  onSelect: () => void;
}

const SettingsProfileBadgeGroup = (props: Props) => {
  const {values, onSelect} = props;
  const styles = useStyles();
  const theme = useTheme();

  const wrappedValues = useMemo(() => {
    const radioValues: {label: string; value: string | number}[] | undefined =
      [];
    return values.map((value, index) => {
      radioValues.push({
        label: '',
        value: value.status,
      });
      return (
        <Shadow
          key={`w_${index.toString()}`}
          viewStyle={[styles.externalShadow]}
          startColor="rgba(37, 87, 188, 0.1)"
          distance={40}
          offset={[10, 20]}
          radius={theme.roundness}>
          <Shadow
            viewStyle={[styles.container]}
            startColor="rgba(16, 24, 40, 0.05)"
            distance={10}
            offset={[0, 1]}
            radius={theme.roundness}>
            <Image
              source={value.profilePicture}
              style={styles.profilePicture}
            />
            <View style={styles.textContainer}>
              <Typography.H4>{value.nickname}</Typography.H4>
              <Typography.Body6>{value.dTag}</Typography.Body6>
            </View>
            <View style={styles.radioButton}>
              <RadioButtonInput
                obj={radioValues}
                index={index}
                isSelected={value.status !== 0}
                onPress={onSelect}
                buttonSize={12}
                // @ts-ignore
                borderWidth={2}
                buttonInnerColor="#F3725A"
                buttonOuterColor="#F3725A"
              />
            </View>
          </Shadow>
        </Shadow>
      );
    });
  }, [values]);

  return <View>{wrappedValues}</View>;
};

export default SettingsProfileBadgeGroup;
