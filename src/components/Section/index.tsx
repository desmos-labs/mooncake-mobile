import React, {useMemo} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
import useStyles from './useStyles';
import Typography from '../Typography';

export type Props = {
  /**
   * Title to display at the top of the section
   */
  title?: string;
  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const Section: React.FC<Props> = props => {
  const {title, style, children} = props;
  const styles = useStyles();
  const theme = useTheme();

  const wrapped = useMemo(() => {
    return React.Children.map(children, (c, index) => {
      return <View key={`w_${index.toString()}`}>{c}</View>;
    });
  }, [children]);

  return (
    <Shadow
      viewStyle={[style, styles.container]}
      startColor="rgba(37, 87, 188, 0.1)"
      distance={40}
      offset={[20, 30]}
      radius={theme.roundness}>
      {title ? (
        <Typography.Subtitle3 style={styles.title}>
          {title}
        </Typography.Subtitle3>
      ) : null}
      <View>{wrapped}</View>
    </Shadow>
  );
};

export default Section;
