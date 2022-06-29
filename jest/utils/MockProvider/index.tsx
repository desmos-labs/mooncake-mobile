import React, { ReactNode } from "react";
import {Provider as PaperProvider } from 'react-native-paper';
import LightTheme from "config/theme/LightTheme";

type Props = {
  children: ReactNode;
}

/**
 * A HOC for use as a provider for tests that require a theme context
 */
const MockProvider = ({children}: Props) => {
  return (
    <PaperProvider theme={LightTheme}>
      {children}
    </PaperProvider>
  )
}

export default MockProvider;
