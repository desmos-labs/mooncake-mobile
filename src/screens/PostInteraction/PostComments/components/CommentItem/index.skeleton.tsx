import React from 'react';
import { HStack, Skeleton, VStack } from 'native-base';
import useStyles from './useStyles';

const CommentItemSkeleton = () => {
  const styles = useStyles({ comment: {} as any, disableInnerComment: false });

  return (
    <HStack style={styles.container}>
      <Skeleton style={styles.avatar} />
      <VStack flex={1}>
        <Skeleton mb="s" width="75%" height={4} borderRadius={12} />
        <Skeleton width="75%" height={4} borderRadius={12} />
        <Skeleton my="m" height={12} borderRadius={12} />
        <Skeleton height={4} borderRadius={12} />
      </VStack>
    </HStack>
  );
};

export default CommentItemSkeleton;
