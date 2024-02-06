import {
  TypographyConfigRegular14,
  TypographyConfigSemibold14,
} from '@desmoslabs/desmos-kit-ui/components/Typography/config';
import ReadMore from 'components/ReadMore';
import { makeStyle } from 'config/theme';
import React from 'react';
import { Text, TextStyle, TouchableOpacity } from 'react-native';

interface Props {
  text: string;
  numberOfLines: number;
}

const Biography = ({ text, numberOfLines }: Props) => {
  const styles = useStyles();

  const renderTruncatedFooter = (handlePress: () => void) => {
    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.textButton}>More</Text>
      </TouchableOpacity>
    );
  };

  const renderRevealedFooter = (handlePress: () => void) => {
    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.textButton}>Less</Text>
      </TouchableOpacity>
    );
  };

  const Style: TextStyle = {
    ...TypographyConfigRegular14,
    color: '#34383E',
  };

  return (
    <ReadMore
      numberOfLines={numberOfLines}
      textStyle={Style}
      renderRevealedFooter={renderRevealedFooter}
      renderTruncatedFooter={renderTruncatedFooter}>
      {text}
    </ReadMore>
  );
};

const useStyles = makeStyle(theme => ({
  textButton: {
    ...TypographyConfigSemibold14,
    color: theme.colors.primary,
  },
  indicator: {
    alignSelf: 'flex-start',
  },
}));

export default Biography;
