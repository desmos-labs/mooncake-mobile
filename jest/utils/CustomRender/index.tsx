import React, { FC, ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { Options } from "@testing-library/react-native/build/render";
import {Provider as PaperProvider} from 'react-native-paper';
import LightTheme from "config/theme/LightTheme";
import { RecoilRoot } from "recoil";

/**
 * A custom render function for use in unit tests for components that
 * require a PaperProvider (or any other Provider) context
 */
const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RecoilRoot>
      <PaperProvider theme={LightTheme}>
        {children}
      </PaperProvider>
    </RecoilRoot>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<Options, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";
export { customRender as render };
