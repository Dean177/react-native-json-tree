import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { JSONNode } from './Nodes';
import createStylingFromTheme from './createStylingFromTheme';
import { invertTheme } from 'react-base16-styling';

const identity = value => value;
const expandRootNode = (_keyName, _data, level) => level === 0;
const defaultItemString = (_type, _data, itemType, itemString) => (
  <Text>
    {itemType} {itemString}
  </Text>
);
const defaultLabelRenderer = ([label]) => <Text>{label}:</Text>;
const noCustomNode = () => false;

/* eslint-disable no-param-reassign */
function checkLegacyTheming(theme, props) {
  const deprecatedStylingMethodsMap = {
    getArrowStyle: 'arrow',
    getListStyle: 'nestedNodeChildren',
    getItemStringStyle: 'nestedNodeItemString',
    getLabelStyle: 'label',
    getValueStyle: 'valueText',
  };

  const deprecatedStylingMethods = Object.keys(
    deprecatedStylingMethodsMap
  ).filter(name => props[name]);

  if (deprecatedStylingMethods.length > 0) {
    if (typeof theme === 'string') {
      theme = { extend: theme };
    } else {
      theme = { ...theme };
    }

    deprecatedStylingMethods.forEach(name => {
      // eslint-disable-next-line no-console
      console.error(
        `Styling method "${name}" is deprecated, use the "theme" property instead`
      );

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

function getStateFromProps(props) {
  let theme = checkLegacyTheming(props.theme, props);
  if (props.invertTheme) {
    theme = invertTheme(theme);
  }

  return {
    styling: createStylingFromTheme(theme),
  };
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
    keyPath: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    postprocessValue: PropTypes.func,
    sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  };

  static defaultProps = {
    shouldExpandNode: expandRootNode,
    hideRoot: false,
    keyPath: ['root'],
    getItemString: defaultItemString,
    labelRenderer: defaultLabelRenderer,
    valueRenderer: identity,
    postprocessValue: identity,
    isCustomNode: noCustomNode,
    collectionLimit: 50,
    invertTheme: true,
    sortObjectKeys: true,
  };

  constructor(props) {
    super(props);
    this.state = getStateFromProps(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (['theme', 'invertTheme'].find(k => props[k] !== state[k])) {
      return getStateFromProps(props);
    }
    return null;
  }

  shouldComponentUpdate(nextProps) {
    return !!Object.keys(nextProps).find(k =>
      k === 'keyPath'
        ? nextProps[k].join('/') !== this.props[k].join('/')
        : nextProps[k] !== this.props[k]
    );
  }

  render() {
    const {
      data: value,
      keyPath,
      postprocessValue,
      hideRoot,
      theme, // eslint-disable-line no-unused-vars
      invertTheme: _, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;

    const { styling } = this.state;

    return (
      <View {...styling('tree')}>
        <JSONNode
          {...{ postprocessValue, hideRoot, styling, ...rest }}
          keyPath={hideRoot ? [] : keyPath}
          value={postprocessValue(value)}
        />
      </View>
    );
  }
}

export default JSONTree;
