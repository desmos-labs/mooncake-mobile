import React from 'react';
import {Text, FlatList, ListRenderItemInfo, View} from 'react-native';
import NoComments from 'screens/PostInteraction/PostComments/components/NoComments';

const PostComments = () => {
  const renderItem = React.useCallback((info: ListRenderItemInfo<any>) => {
    console.log(info);
    return (
      <View>
        <Text>Hello world</Text>
      </View>
    );
  }, []);

  const ListEmptyComponent = React.useCallback(() => {
    return (
      <NoComments
        handlePress={() => {
          console.log('add comment');
        }}
      />
    );
  }, []);

  return (
    <FlatList
      data={[]}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

export default PostComments;
