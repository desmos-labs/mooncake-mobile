import {Component, PropsWithChildren, ReactNode} from 'react';

/* If an error occurs, render the fallback instead of the children. */
class ErrorBoundary extends Component<
  PropsWithChildren<{fallback: ReactNode}>,
  Error
> {
  static getDerivedStateFromError(error: Error) {
    return error;
  }

  render() {
    if (this.state) {
      const {fallback} = this.props;
      return fallback;
    }
    const {children} = this.props;
    return children;
  }
}

export default ErrorBoundary;
