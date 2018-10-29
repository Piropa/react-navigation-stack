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

import defaultBackImage from '../assets/back-icon.png';

class HeaderBackButton extends React.PureComponent {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
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

  _renderBackImage() {
    const { imageSource: backImage, title, tintColor } = this.props;

    let BackImage;
    let props;

    if (React.isValidElement(backImage)) {
      return backImage;
    } else if (typeof backImage === 'function') {
      BackImage = backImage;
      props = {
        tintColor,
        title,
      };
    } else {
      let sourceImage = undefined,
        sourceFunc = undefined,
        moreProps = undefined;
      if (backImage && typeof backImage === 'object' && backImage.source) {
        if (React.isValidElement(backImage.source)) {
          return backImage.source;
        } else if (typeof backImage.source === 'function') {
          sourceFunc = backImage.source;
          moreProps = { tintColor, title };
        } else sourceImage = backImage.source;
      }
      BackImage = sourceFunc || Image;
      props = {
        style: [
          styles.icon,
          !sourceFunc && styles.iconResizeMode,
          !!title && styles.iconWithTitle,
          !sourceFunc && !!tintColor && { tintColor },
        ],
        source: sourceImage || defaultBackImage,
        ...moreProps,
      };
    }

    return <BackImage {...props} />;
  }

  _maybeRenderTitle() {
    const {
      layoutPreset,
      titleVisible: backTitleVisible,
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

    const backButtonTitle = renderTruncated ? truncatedTitle : title;

    // If the left preset is used and we aren't on Android, then we
    // default to disabling the label
    const titleDefaultsToDisabled =
      layoutPreset === 'left' ||
      Platform.OS === 'android' ||
      typeof backButtonTitle !== 'string';

    // If the title is explicitly enabled then we respect that
    if (titleDefaultsToDisabled && !backTitleVisible) {
      return null;
    }

    return (
      <Text
        accessible={false}
        onLayout={this._onTextLayout}
        style={[styles.title, !!tintColor && { color: tintColor }, titleStyle]}
        numberOfLines={1}
      >
        {backButtonTitle}
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
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          {this._renderBackImage()}
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
          marginLeft: 9,
          marginRight: 22,
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
          marginRight: 6,
        }
      : {},
});

export default HeaderBackButton;
