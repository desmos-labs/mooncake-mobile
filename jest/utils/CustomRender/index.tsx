import React, { FC, ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { Options } from "@testing-library/react-native/build/render";
import MockProvider from "../MockProvider";

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockProvider>
      {children}
    </MockProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<Options, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";
export { customRender as render };
