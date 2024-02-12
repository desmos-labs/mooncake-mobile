import { ImageStyle, StyleProp } from 'react-native';
import { ImageContentFit } from 'expo-image/src/Image.types';
import { ImageProps } from 'expo-image';

/**
 * Options for rendering media attachments.
 */
export interface MediaRenderOptions {
  readonly resizeMode?: ImageContentFit;
  readonly imageStyle?: StyleProp<ImageStyle>;
  readonly useAutoSize?: boolean;
  readonly horizontalPaddingWithAutoSize?: number;
}

/**
 * Options for rendering attachments.
 */
export interface AttachmentRenderOptions {
  readonly media?: MediaRenderOptions;
}

export type RenderProps = Pick<ImageProps, 'contentFit' | 'style'>;
