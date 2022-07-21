import MaterialButton from 'components/MaterialButton';
import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';

type Props = React.ComponentProps<typeof MaterialButton>;

/**
 * This HOC should be used to have a correct animation of the button in iOS as well,
 * since the MaterialButton does not have a consistent animation with both operating systems
 * @param onPress The function to when the button is clicked
 * @param rest Every other param of the MaterialButton
 */
const Button: React.FC<Props> = ({onPress, ...rest}: Props) => {
  return Platform.OS === 'ios' ? (
    rest.mode === 'text' ? (
      <MaterialButton onPress={onPress} {...rest} />
    ) : (
      <TouchableOpacity disabled={rest.disabled} onPress={onPress}>
        <MaterialButton {...rest} />
      </TouchableOpacity>
    )
  ) : (
    <MaterialButton onPress={onPress} {...rest} />
  );
};

export default Button;
