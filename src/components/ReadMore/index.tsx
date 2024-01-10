import React, { Component, RefObject } from 'react';
import { Text, TextStyle, TouchableOpacity, View } from 'react-native';

interface ReadMoreProps {
  numberOfLines: number;
  textStyle: TextStyle;
  buttonStyle?: TextStyle;
  children: React.ReactNode;
  renderTruncatedFooter?: (handlePressReadMore: () => void) => React.ReactNode;
  renderRevealedFooter?: (handlePressReadLess: () => void) => React.ReactNode;
  onReady?: () => void;
}

interface ReadMoreState {
  measured: boolean;
  shouldShowReadMore: boolean;
  showAllText: boolean;
}

const initialState: ReadMoreState = {
  measured: false,
  shouldShowReadMore: false,
  showAllText: false,
};

class ReadMore extends Component<ReadMoreProps, ReadMoreState> {
  _text: RefObject<Text> = React.createRef<Text>();

  _isMounted: boolean = false;

  constructor(props: ReadMoreProps) {
    super(props);
    this.state = { ...initialState };
  }

  async componentDidMount() {
    this._isMounted = true;
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    await this.compareTextHeightMeasurements();
  }

  async componentDidUpdate(prevProps: ReadMoreProps) {
    const { children } = this.props;
    if (children !== prevProps.children) {
      this.resetState();
      await nextFrameAsync();
      await this.compareTextHeightMeasurements();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _handlePressReadMore = () => {
    this.setState({ showAllText: true });
  };

  _handlePressReadLess = () => {
    this.setState({ showAllText: false });
  };

  async compareTextHeightMeasurements() {
    const { onReady } = this.props;
    if (this._text.current) {
      const fullHeight = await measureHeightAsync(this._text.current);

      this.setState({ measured: true });
      await nextFrameAsync();

      if (!this._isMounted) {
        return;
      }

      const limitedHeight = await measureHeightAsync(this._text.current);

      if (fullHeight > limitedHeight) {
        this.setState({ shouldShowReadMore: true }, () => {
          onReady && onReady();
        });
      } else {
        onReady && onReady();
      }
    }
  }

  resetState() {
    this.setState({ ...initialState });
  }

  _maybeRenderReadMore() {
    const { shouldShowReadMore, showAllText } = this.state;
    const { renderTruncatedFooter, renderRevealedFooter, buttonStyle } = this.props;

    if (shouldShowReadMore && !showAllText) {
      if (renderTruncatedFooter) {
        return renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <TouchableOpacity style={buttonStyle} onPress={this._handlePressReadMore}>
          <Text>Read more</Text>
        </TouchableOpacity>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (renderRevealedFooter) {
        return renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <TouchableOpacity style={buttonStyle} onPress={this._handlePressReadMore}>
          <Text>Hide</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const { measured, showAllText } = this.state;
    const { numberOfLines, textStyle, children } = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          style={textStyle}
          ref={this._text}>
          {children}
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    );
  }
}

function measureHeightAsync(component: Text): Promise<number> {
  return new Promise(resolve => {
    component.measure((_x, _y, _w, h) => {
      resolve(h);
    });
  });
}

async function nextFrameAsync(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

export default ReadMore;
