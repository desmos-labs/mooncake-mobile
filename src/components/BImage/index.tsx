import React from 'react';
import { Image, ImageErrorEventData, ImageProps } from 'expo-image';
import BSkeleton from 'components/BSkeleton';

interface BImageProps extends ImageProps {
  /**
   * Skeleton border radius.
   * Can be `square`, `round`, or a number. `round` makes it a circle.
   * Defaults to `8`.
   */
  readonly skeletonRadius?: 'round' | 'square' | number;
}

/**
 * Component that wraps the expo-image to have
 * a custom loading animation using the skeleton effect.
 */
const BImage: React.FC<BImageProps> = ({ skeletonRadius, onLoadEnd, onError, ...props }) => {
  const [loadCompleted, setLoadCompleted] = React.useState(false);
  const sourceUri: string | undefined =
    // @ts-ignore
    typeof props?.source === 'object' ? props?.source?.uri : undefined;
  const isLoading = !loadCompleted && !!sourceUri;

  const onImageLoadEndSucessfully = React.useCallback(() => {
    setLoadCompleted(true);
    onLoadEnd?.();
  }, [onLoadEnd]);

  const onImageLoadError = React.useCallback(
    (event: ImageErrorEventData) => {
      setLoadCompleted(true);
      console.error('[BImage]', event.error);
      onError?.(event);
    },
    [onError],
  );

  return (
    <BSkeleton show={isLoading} radius={skeletonRadius} disableExitAnimation={true}>
      <Image onLoadEnd={onImageLoadEndSucessfully} onError={onImageLoadError} {...props} />
    </BSkeleton>
  );
};

export default BImage;
