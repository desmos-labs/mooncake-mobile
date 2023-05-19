import { Platform, RefreshControl } from 'react-native';
import { AndroidColor } from '@notifee/react-native';
import HomeItemSeparatorComponent from 'screens/Home/components/HomeItemSeparatorComponent';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { Post } from 'types/posts';
import { FlashListProps } from '@shopify/flash-list/src/FlashListProps';

const PostList = (props: FlashListProps<any>) => {
  const getPostType = useCallback((item: Post) => {
    if (item.attachments && item.attachments.length > 0 && item.text) {
      return 'text+media';
    }
    if (item.attachments && item.attachments.length > 0) {
      return 'media';
    }
    if (item.text) {
      return 'text';
    }
    return 'default';
  }, []);

  return (
    <FlashList
      keyExtractor={(item, index) => `${index}item+${item.id}`}
      ref={props.ref}
      data={posts}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.surfaceBlack}
          colors={[AndroidColor.BLACK]}
          enabled
          onRefresh={onRefresh}
          refreshing={refreshing}
          progressViewOffset={Platform.OS === 'android' ? 30 : 0}
        />
      }
      renderItem={renderPost}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={footerComponent}
      ListEmptyComponent={emptyComponent}
      estimatedItemSize={180}
      ItemSeparatorComponent={HomeItemSeparatorComponent}
      onEndReached={fetchMorePosts}
      getItemType={getPostType}
    />
  );
};

export default PostList;
