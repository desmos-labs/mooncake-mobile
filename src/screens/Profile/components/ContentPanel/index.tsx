import React from 'react';
import {View} from 'react-native';
import Typography from 'components/Typography';
import {useTheme} from 'react-native-paper';
import ContentTabs, {
  ContentPanelProps,
} from 'screens/Profile/components/ContentPanel/ContentTabs';
import FakeDropShadow from './FakeDropShadow';

interface Props extends ContentPanelProps {
  tabs: string[];
}

const ContentPanel = ({tabs, handleTabPressed, selectedIndex}: Props) => {
  const theme = useTheme();

  return (
    <>
      <FakeDropShadow />
      <View
        style={{
          flexGrow: 1,
          backgroundColor: theme.colors.background,
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          padding: theme.spacing.m,
        }}>
        <ContentTabs
          tabs={tabs}
          selectedIndex={selectedIndex}
          handleTabPressed={handleTabPressed}
        />

        <Typography.Button2
          style={{
            height: 1000,
          }}>
          hello world
        </Typography.Button2>
      </View>
    </>
  );
};

export default ContentPanel;
