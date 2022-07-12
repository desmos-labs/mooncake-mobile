import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import {makeStyle} from 'config/theme';

export interface ContentPanelProps {
  tabs: string[];

  selectedIndex: number;

  handleTabPressed: (_index: number) => void;
}

const INDICATOR_SIZE = 5;

const ContentTabs = ({
  tabs,
  selectedIndex,
  handleTabPressed,
}: ContentPanelProps) => {
  const styles = useStyles();

  const renderTabs = React.useCallback(
    (tab: string, index: number) => {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleTabPressed(index)}>
          <Typography.Button2>{tab}</Typography.Button2>

          <View
            style={[
              styles.indicator,
              {opacity: selectedIndex === index ? 1 : 0},
            ]}
          />
        </TouchableOpacity>
      );
    },
    [tabs, selectedIndex],
  );

  return <View style={styles.container}>{tabs.map(renderTabs)}</View>;
};

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    alignItems: 'center',
  },
  indicator: {
    marginTop: theme.spacing.xs,
    height: INDICATOR_SIZE,
    width: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: theme.colors.primary,
  },
}));

export default ContentTabs;
