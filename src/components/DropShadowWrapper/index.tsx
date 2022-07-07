import React from 'react';
import {ViewProps, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
import useStyles from './useStyles';

export type Props = ViewProps & {
  innerStyle?: ViewStyle;
};

const DropShadowWrapper: React.FC<Props> = props => {
  const {children, style, innerStyle} = props;
  const styles = useStyles();
  const theme = useTheme();
  return (
    <Shadow
      viewStyle={[style, styles.externalShadow]}
      startColor="rgba(37, 87, 188, 0.1)"
      distance={40}
      offset={[10, 20]}
      radius={theme.roundness}>
      <Shadow
        viewStyle={[innerStyle, styles.innerShadow]}
        startColor="rgba(16, 24, 40, 0.05)"
        distance={10}
        offset={[0, 1]}
        radius={theme.roundness}>
        {children}
      </Shadow>
    </Shadow>
  );
};

export default DropShadowWrapper;
