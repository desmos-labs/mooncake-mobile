import { ImageStyle, StyleProp } from 'react-native';
import { ImageContentFit } from 'expo-image/src/Image.types';

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
