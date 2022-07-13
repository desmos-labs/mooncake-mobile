import React from 'react';
import {View} from 'react-native';
import Typography from 'components/Typography';
import ContentTabs, {
  ContentPanelProps,
} from 'screens/Profile/components/ContentPanel/ContentTabs';
import FakeDropShadow from './FakeDropShadow';
import ProfilePostCard from '../ProfilePostCard';
import useStyles from './useStyles';

interface Props extends ContentPanelProps {
  tabs: string[];

  posts: PostItem[];

  handlePostPressed: ({
    subspaceID,
    authorAddress,
    id,
  }: {
    subspaceID: number;
    authorAddress: string;
    id: number;
  }) => void;
}

const ContentPanel = ({
  tabs,
  handleTabPressed,
  selectedIndex,
  posts,
  handlePostPressed,
}: Props) => {
  const styles = useStyles();

  const content = React.useMemo(() => {
    return (
      <View style={styles.contentContainer}>
        {selectedIndex === 0 ? (
          posts.map(post => (
            <ProfilePostCard
              postData={post}
              onPress={() =>
                handlePostPressed({
                  subspaceID: post.subspace_id,
                  authorAddress: post.author_address,
                  id: post.id,
                })
              }
            />
          ))
        ) : (
          <Typography.Body1 style={{flexGrow: 1}}>
            Portfolio goes here
          </Typography.Body1>
        )}
      </View>
    );
  }, [selectedIndex, posts]);

  return (
    <>
      <FakeDropShadow />
      <View style={styles.container}>
        <ContentTabs
          tabs={tabs}
          selectedIndex={selectedIndex}
          handleTabPressed={handleTabPressed}
        />

        {content}
      </View>
    </>
  );
};

export default ContentPanel;
