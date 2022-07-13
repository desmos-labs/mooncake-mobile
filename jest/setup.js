import '../src/assets/locales/i18n';
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
import keychainMock from 'jest/keychainMock';

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-keychain', () => keychainMock);
