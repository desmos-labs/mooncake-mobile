# Patches

This folder contains patches created using patch-package.

## @testing-library/react-native

- export the `Options` type so it can be referenced in `jest/CustomRender`

## react-native-mmkv

- apply a patch that fixes android compatibility with RN 0.69

## react-native-reanimated-carousel

- exposes the true offsetX value as a third parameter in the `onProgressChanged` prop, for use in detecting overscroll.
