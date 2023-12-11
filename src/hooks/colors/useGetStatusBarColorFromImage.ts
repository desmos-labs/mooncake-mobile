import { useFocusEffect } from '@react-navigation/native';
import { StatusBarStyle } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { getColors } from 'react-native-image-colors';

function hexToRGB(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return {
      r,
      g,
      b,
      a: alpha,
    };
  } else {
    return {
      r,
      g,
      b,
    };
  }
}

const useGetStatusBarColorFromImage = (image?: string) => {
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>();
  const brightness = (r: number, g: number, b: number) => (r * 299 + g * 587 + b * 114) / 1000;

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        return;
      }
      if (!image) {
        setStatusBarStyle('dark');
        return;
      }
      getColors(image, {
        fallback: '#000000',
        cache: true,
        key: image,
      }).then(colors => {
        if (colors.platform === 'android') {
          if (colors.dominant) {
            const { r, g, b } = hexToRGB(colors.dominant, 1);
            const isDark = brightness(r, g, b) < 128;
            if (isDark) {
              setStatusBarStyle('light');
            } else {
              setStatusBarStyle('dark');
            }
          }
        } else if (colors.platform === 'ios') {
          const { background, primary, detail } = colors;

          const backgroundBrightnessHex = hexToRGB(background, 1);
          const primaryBrightnessHex = hexToRGB(primary, 1);
          const detailBrightnessHex = hexToRGB(detail, 1);

          const backgroundBrightness = brightness(
            backgroundBrightnessHex.r,
            backgroundBrightnessHex.g,
            backgroundBrightnessHex.b,
          );
          const primaryBrightness = brightness(
            primaryBrightnessHex.r,
            primaryBrightnessHex.g,
            primaryBrightnessHex.b,
          );
          const detailBrightness = brightness(
            detailBrightnessHex.r,
            detailBrightnessHex.g,
            detailBrightnessHex.b,
          );
          if (backgroundBrightness > primaryBrightness && backgroundBrightness > detailBrightness) {
            setStatusBarStyle('dark');
          } else {
            setStatusBarStyle('light');
          }
        }
      });
    }, [image]),
  );

  return {
    statusBarStyle,
  };
};

export default useGetStatusBarColorFromImage;
