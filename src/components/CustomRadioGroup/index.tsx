import Typography from 'components/Typography';
import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {RadioButtonInput} from 'react-native-simple-radio-button';

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
  const {values, selectedValue, onSelect} = props;
  const theme = useTheme();

  return (
    <View>
      {values.map((value, index) => {
        return (
          <View style={{flexDirection: 'row'}} key={`${value.value}`}>
            <RadioButtonInput
              buttonStyle={{marginBottom: theme.spacing.m}}
              obj={value}
              index={index}
              onPress={() => onSelect(index, value.value)}
              isSelected={selectedValue === index}
              buttonSize={12}
              // @ts-ignore
              borderWidth={1}
              buttonInnerColor={
                selectedValue === index
                  ? theme.colors.butterOrange01
                  : theme.colors.black
              }
              buttonOuterColor={
                selectedValue === index
                  ? theme.colors.butterOrange01
                  : theme.colors.black
              }
            />
            <Typography.Body6 style={{marginLeft: theme.spacing.m}}>
              {value.label}
            </Typography.Body6>
          </View>
        );
      })}
    </View>
  );
};

export default CustomRadioGroup;
