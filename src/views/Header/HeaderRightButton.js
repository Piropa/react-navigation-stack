import React from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import TouchableItem from '../TouchableItem';

import defaultRightImage from '../assets/more-icon.png';

class HeaderRightButton extends React.PureComponent {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'more',
  };

  state = {};

  _onTextLayout = e => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  _renderRightImage() {
    const { imageSource: rightImage, title, tintColor } = this.props;

    let RightImage;
    let props;

    if (React.isValidElement(rightImage)) {
      return rightImage;
    } else if (typeof rightImage === 'function') {
      RightImage = rightImage;
      props = {
        tintColor,
        title,
      };
    } else {
      let sourceImage = undefined,
        sourceFunc = undefined,
        moreProps = undefined;
      if (rightImage && typeof rightImage === 'object' && rightImage.source) {
        if (React.isValidElement(rightImage.source)) {
          return rightImage.source;
        } else if (typeof rightImage.source === 'function') {
          sourceFunc = rightImage.source;
          moreProps = { tintColor, title };
        } else sourceImage = rightImage.source;
      }
      RightImage = sourceFunc || Image;
      props = {
        style: [
          styles.icon,
          !sourceFunc && styles.iconResizeMode,
          !!title && styles.iconWithTitle,
          !sourceFunc && !!tintColor && { tintColor },
        ],
        source: sourceImage || defaultRightImage,
        ...moreProps,
      };
    }

    return <RightImage {...props} />;
  }

  _maybeRenderTitle() {
    const {
      layoutPreset,
      titleVisible: rightTitleVisible,
      width,
      title,
      titleStyle,
      tintColor,
      truncatedTitle,
    } = this.props;

    const renderTruncated =
      this.state.initialTextWidth && width
        ? this.state.initialTextWidth > width
        : false;

    const rightButtonTitle = renderTruncated ? truncatedTitle : title;

    // If the left preset is used and we aren't on Android, then we
    // default to disabling the label
    const titleDefaultsToDisabled =
      layoutPreset === 'left' ||
      Platform.OS === 'android' ||
      typeof rightButtonTitle !== 'string';

    // If the title is explicitly enabled then we respect that
    if (titleDefaultsToDisabled && !rightTitleVisible) {
      return null;
    }

    return (
      <Text
        accessible={false}
        onLayout={this._onTextLayout}
        style={[styles.title, !!tintColor && { color: tintColor }, titleStyle]}
        numberOfLines={1}
      >
        {rightButtonTitle}
      </Text>
    );
  }

  render() {
    const { onPress, pressColorAndroid, title } = this.props;

    let button = (
      <TouchableItem
        accessible
        accessibilityComponentType="button"
        accessibilityLabel={title}
        accessibilityTraits="button"
        testID="header-right"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          {this._renderRightImage()}
          {this._maybeRenderTitle()}
        </View>
      </TouchableItem>
    );

    if (Platform.OS === 'android') {
      return <View style={styles.androidButtonWrapper}>{button}</View>;
    } else {
      return button;
    }
  }
}

const styles = StyleSheet.create({
  androidButtonWrapper: {
    margin: 13,
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon:
    Platform.OS === 'ios'
      ? {
          height: 21,
          width: 13,
          marginLeft: 22,
          marginRight: 9,
          marginVertical: 12,
          // resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        }
      : {
          height: 24,
          width: 24,
          margin: 3,
          // resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        },
  iconResizeMode: {
    resizeMode: 'contain',
  },
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginLeft: 6,
        }
      : {},
});

export default HeaderRightButton;
