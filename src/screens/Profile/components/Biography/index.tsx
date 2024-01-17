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
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'left',
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
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'left',
    color: theme.colors.accentBlue01,
  },
  indicator: {
    alignSelf: 'flex-start',
  },
}));

export default Biography;
