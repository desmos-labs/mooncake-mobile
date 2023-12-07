import { makeStyle } from 'config/theme';
import React from 'react';
import { Animated, View } from 'react-native';

interface Props {
  pages: any[];
  scrollX: any;
  width: number;
}

const PaginationDots = ({ pages, scrollX, width }: Props) => {
  const styles = useStyles();
  return (
    <View style={styles.view}>
      {pages.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 16, 8],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#DDDDDD', '#FEB027', '#DDDDDD'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, backgroundColor }]}
            key={(i + 10).toString()}
          />
        );
      })}
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  view: { flexDirection: 'row', height: 10 },
  dot: { height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, marginHorizontal: 6 },
}));

export default PaginationDots;
