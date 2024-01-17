import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { HStack, useTheme } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { RadioButtonInput } from 'react-native-simple-radio-button';

/**
 * Simple interface to display a radio button
 */
export interface RadioValue {
  /**
   * The label of the radio button
   */
  label: string;
  /**
   * The value of the radio button
   */
  value: string;
}

interface Props {
  /**
   * Values to be displayed as radio buttons.
   */
  values: RadioValue[];
  /**
   * The selected value to be displayed.
   */
  selectedValue: number;
  /**
   * Callback usefull when selecting a value.
   */
  onSelect: (index: number, value: string) => void;
}

const CustomRadioGroup = (props: Props) => {
  const { values, selectedValue, onSelect } = props;
  const theme = useTheme();

  return (
    <View>
      {values.map((value, index) => {
        return (
          <HStack key={`${value.value}`}>
            <RadioButtonInput
              accessibilityLabel={`${value.value}-radio-button`}
              buttonStyle={{ marginBottom: theme.spacing.m }}
              obj={value}
              index={index}
              onPress={() => onSelect(index, value.value)}
              isSelected={selectedValue === index}
              buttonSize={12}
              // @ts-ignore
              borderWidth={1}
              buttonInnerColor={
                selectedValue === index ? theme.colors.butterOrange01 : theme.colors.white
              }
              buttonOuterColor={
                selectedValue === index ? theme.colors.butterOrange01 : theme.colors.surfaceBlack
              }
            />
            <Typography.Regular16 style={{ marginLeft: theme.spacing.m }}>
              {value.label}
            </Typography.Regular16>
          </HStack>
        );
      })}
    </View>
  );
};

export default CustomRadioGroup;
