import { Skeleton } from 'moti/skeleton';
import React from 'react';

type MotiSkeletonProps = React.ComponentProps<typeof Skeleton>;

interface BSkeletonContentProps extends MotiSkeletonProps {}

/**
 * Wrapper around the SkeletonContent component
 * that will use the colors from our theme.
 */
const BSkeleton: React.FC<BSkeletonContentProps> = props => {
  return <Skeleton colorMode="light" {...props} />;
};

export default BSkeleton;
