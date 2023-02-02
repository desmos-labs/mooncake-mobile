import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
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
        <View style={styles.innerContainer}>
          <View style={styles.bullet} />

          <Typography.Body5>{x}</Typography.Body5>
        </View>
      ))}
    </View>
  );
};

export default TextBullet;
