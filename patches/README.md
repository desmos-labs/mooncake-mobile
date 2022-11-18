# Patches

This folder contains patches created using patch-package.

## @testing-library/react-native

- export the `Options` type so it can be referenced in `jest/CustomRender`

## react-native-mmkv

- apply a patch that fixes android compatibility with RN 0.69

## noble-hashes
- Replace bit shift operators with ones from BigInteger (android compatibility)

## react-native-camera-roll/camera-roll
- Pass mimetype in selected images

## react-native-circular-progress
- Patch the ColorValue prop to support colors represented as a string

## react-native-toast-notifications
- Apply a fix for https://github.com/arnnis/react-native-toast-notifications/issues/127
- Add a second onPress handler called `onPressRetry` to specifically handle when the user presses `retry` on error type toasts

