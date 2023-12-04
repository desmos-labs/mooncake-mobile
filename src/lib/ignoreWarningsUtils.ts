import { LogBox } from 'react-native';

if (__DEV__) {
  const ignoreWarns = ['Non-serializable values were found in the navigation state.'];

  const { warn } = console;
  console.warn = (...arg) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith && arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}
