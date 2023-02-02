import DropShadowWrapper from 'components/DropShadowWrapper';
import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
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
  const { title, style, children } = props;
  const styles = useStyles();

  const wrapped = useMemo(() => {
    return React.Children.map(children, (c, index) => {
      return <View key={`w_${index.toString()}`}>{c}</View>;
    });
  }, [children]);

  return (
    <DropShadowWrapper style={[style, styles.container]} innerStyle={styles.innerContainer}>
      {title ? <Typography.Subtitle3 style={styles.title}>{title}</Typography.Subtitle3> : null}
      <View>{wrapped}</View>
    </DropShadowWrapper>
  );
};

export default Section;
