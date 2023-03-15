import React, {FC, ReactElement} from 'react';
import {render} from '@testing-library/react-native';
import {Options} from '@testing-library/react-native/build/render';
import {NativeBaseProvider} from "native-base";
import {RecoilRoot} from 'recoil';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {MeasureOptions, measurePerformance} from '@callstack/reassure-measure';
import customTheme from "config/theme/CustomTheme";

/**
 * A custom render function for use in unit tests for components that
 * require a PaperProvider (or any other Provider) context
 */
const AllTheProviders: FC<{children: React.ReactElement}> = ({children}) => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <NativeBaseProvider theme={customTheme}>
          <SafeAreaProvider style={{flex: 1}}>{children}</SafeAreaProvider>
        </NativeBaseProvider>
      </NavigationContainer>
    </RecoilRoot>
  );
};

const ReassureCompatWrapper = (node: React.ReactElement) => {
  return <AllTheProviders>{node}</AllTheProviders>;
};

const customRender = (ui: ReactElement, options?: Omit<Options, 'wrapper'>) =>
  render(ui, {wrapper: AllTheProviders, ...options});

const customMeasurePerformance = (
  ui: React.ReactElement,
  options?: Omit<MeasureOptions, 'wrapper'>,
) => measurePerformance(ui, {wrapper: ReassureCompatWrapper, ...options});

export * from '@testing-library/react-native';
export {customRender as render};
export {customMeasurePerformance as measurePerformance};
