import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import JSONNode from './JSONNode';
import createStylingFromTheme from './createStylingFromTheme';

const identity = value => value;

/* eslint-disable no-param-reassign */
function checkLegacyTheming(theme, props) {
  const deprecatedStylingMethodsMap = {
    getArrowStyle: 'arrow',
    getListStyle: 'nestedNodeChildren',
    getItemStringStyle: 'nestedNodeItemString',
    getLabelStyle: 'label',
    getValueStyle: 'valueText',
  };

  const deprecatedStylingMethods = Object
    .keys(deprecatedStylingMethodsMap)
    .filter(name => props[name]);

  if (deprecatedStylingMethods.length > 0) {
    if (typeof theme === 'string') {
      theme = { extend: theme };
    } else {
      theme = { ...theme };
    }

    deprecatedStylingMethods.forEach((name) => {
      // eslint-disable-next-line no-console
      console.error(`Styling method "${name}" is deprecated, use the "theme" property instead`);

      theme[deprecatedStylingMethodsMap[name]] = ({ style }, ...args) => ({
        style: {
          ...style,
          ...props[name](...args),
        },
      });
    });
  }

  return theme;
}
/* eslint-enable no-param-reassign */

class JSONTree extends React.Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    hideRoot: PropTypes.bool,
    invertTheme: PropTypes.bool,
    keyPath: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    postprocessValue: PropTypes.func,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  };

  static defaultProps = {
    shouldExpandNode: (keyName, data, level) => level === 0, // expands root by default,
    hideRoot: false,
    keyPath: ['root'],
    getItemString: (type, data, itemType, itemString) => <Text>{itemType} {itemString}</Text>,
    labelRenderer: ([label]) => <Text>{label}:</Text>,
    valueRenderer: identity,
    postprocessValue: identity,
    isCustomNode: () => false,
    collectionLimit: 50,
    invertTheme: true,
    sortObjectKeys: true,
  };

  render() {
    const {
      data: value,
      keyPath,
      postprocessValue,
      hideRoot,
      theme,
      invertTheme,
      ...rest
    } = this.props;

    const styling = createStylingFromTheme(checkLegacyTheming(theme, rest), invertTheme);

    return (
      <View {...styling('tree')}>
        <JSONNode
          hideRoot={hideRoot}
          keyPath={hideRoot ? [] : keyPath}
          postprocessValue={postprocessValue}
          styling={styling}
          value={postprocessValue(value)}
          {...rest}
        />
      </View>
    );
  }
}

export default JSONTree;
