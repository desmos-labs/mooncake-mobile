import '../src/assets/locales/i18n';
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
