import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import React from 'react';
import { View } from 'react-native';
import useStyles from './useStyles';

type Props = {
  textArr: string[];
};

/**
 * A component that renders an array of strings as individual bullet points
 */
const TextBullet = ({ textArr }: Props) => {
  const styles = useStyles();
  return (
    <View style={styles.outerContainer}>
      {textArr.map(x => (
        <View key={x} style={styles.innerContainer}>
          <View style={styles.bullet} />
          <Typography.Regular16>{x}</Typography.Regular16>
        </View>
      ))}
    </View>
  );
};

export default TextBullet;
