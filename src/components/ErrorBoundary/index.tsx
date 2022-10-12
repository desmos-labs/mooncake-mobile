import React, {Component, PropsWithChildren, ReactNode} from 'react';
import {View} from 'react-native';

/* If an error occurs, render the fallback instead of the children. */
class ErrorBoundary extends Component<
  PropsWithChildren<{fallback: ReactNode}>,
  Error
> {
  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary', error);
    return error;
  }

  render() {
    if (this.state) {
      const {fallback} = this.props;
      return fallback;
    }
    const {children} = this.props;
    return <View style={{flex: 1}}>{children}</View>;
  }
}

export default ErrorBoundary;
