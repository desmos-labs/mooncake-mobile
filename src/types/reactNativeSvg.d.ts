import * as React from 'react';

export {};

/*
 * To avoid typescript missing-declaration errors, we need to add the xmlns prop to the Svg component.
 * This is a temporary workaround until we can figure out how to add the xmlns prop to the typescript definitions.
 */
declare module 'react-native-svg' {
  interface SvgProps {
    xmlns?: string;
  }
  interface LinearGradientProps {
    children?: React.ReactNode | undefined;
  }
}
