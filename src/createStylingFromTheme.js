import { createStyling } from 'react-base16-styling';
import solarized from './themes/solarized';

const colorMap = theme => ({
  BACKGROUND_COLOR: theme.base00,
  TEXT_COLOR: theme.base07,
  STRING_COLOR: theme.base0B,
  DATE_COLOR: theme.base0B,
  NUMBER_COLOR: theme.base09,
  BOOLEAN_COLOR: theme.base09,
  NULL_COLOR: theme.base08,
  UNDEFINED_COLOR: theme.base08,
  FUNCTION_COLOR: theme.base08,
  SYMBOL_COLOR: theme.base08,
  LABEL_COLOR: theme.base0D,
  ARROW_COLOR: theme.base0D,
  ITEM_STRING_COLOR: theme.base0B,
  ITEM_STRING_EXPANDED_COLOR: theme.base03,
});

const valueColorMap = colors => ({
  String: colors.STRING_COLOR,
  Date: colors.DATE_COLOR,
  Number: colors.NUMBER_COLOR,
  Boolean: colors.BOOLEAN_COLOR,
  Null: colors.NULL_COLOR,
  Undefined: colors.UNDEFINED_COLOR,
  Function: colors.FUNCTION_COLOR,
  Symbol: colors.SYMBOL_COLOR,
});

const getDefaultTheStyling = theme => {
  const colors = colorMap(theme);

  return {
    tree: {
      backgroundColor: colors.BACKGROUND_COLOR,
      border: 0,
      marginBottom: 0.5,
      marginLeft: 0.125,
      marginRight: 0,
      marginTop: 0.5,
      padding: 0,
    },

    value: ({ style }, nodeType, keyPath) => ({
      style: {
        ...style,
        paddingTop: 0.25,
        paddingRight: 0,
        marginLeft: 0.875,
        paddingLeft: keyPath.length > 1 ? 2.125 : 1.25,
        // TODO
        textIndent: -0.5,
        // TODO
        wordBreak: 'break-all',
        wordWrap: 'break-word',
      },
    }),

    label: { color: colors.LABEL_COLOR },

    valueLabel: {
      // TODO
      // margin: '0 0.5 0 0',
      marginBottom: 0.5,
      marginLeft: 0.125,
      marginRight: 0,
      marginTop: 0.5,
    },

    valueText: ({ style }, nodeType) => ({
      style: {
        ...style,
        color: valueColorMap(colors)[nodeType],
      },
    }),

    itRange: ({ style }, expanded) => ({
      style: {
        paddingTop: expanded ? 0 : 0.25,
        color: colors.LABEL_COLOR,
      },
    }),

    arrow: ({ style }, nodeType, expanded) => ({
      style: {
        ...style,
        marginLeft: 0,
        // TODO
        transition: '150ms',
        transform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
        transformOrigin: '45% 50%',
        position: 'relative',
        lineHeight: 1.1,
        fontSize: 0.75,
      },
    }),

    arrowContainer: ({ style }, arrowStyle) => ({
      style: {
        ...style,
        display: 'inline-block',
        paddingRight: 0.5,
        paddingLeft: arrowStyle === 'double' ? 1 : 0,
      },
    }),

    arrowSign: { color: colors.ARROW_COLOR },

    arrowSignInner: {
      position: 'absolute',
      top: 0,
      left: -0.4,
    },

    nestedNode: ({ style }, keyPath, nodeType, expanded, expandable) => ({
      style: {
        ...style,
        position: 'relative',
        paddingTop: 0.25,
        marginLeft: keyPath.length > 1 ? 0.875 : 0,
        paddingLeft: !expandable ? 1.125 : 0,
      },
    }),

    rootNode: {
      padding: 0,
      margin: 0,
    },

    nestedNodeLabel: ({ style }, keyPath, nodeType, expanded, expandable) => ({
      style: {
        ...style,
        margin: 0,
        padding: 0,
        WebkitUserSelect: expandable ? 'inherit' : 'text',
        MozUserSelect: expandable ? 'inherit' : 'text',
        cursor: expandable ? 'pointer' : 'default',
      },
    }),

    nestedNodeItString: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
        paddingLeft: '0.5',
        cursor: 'default',
        color: expanded ? colors.ITEM_STRING_EXPANDED_COLOR : colors.ITEM_STRING_COLOR,
      },
    }),

    nestedNodeItType: {
      marginLeft: '0.3',
      marginRight: '0.3',
    },

    nestedNodeChildren: ({ style }, nodeType, expanded) => ({
      style: {
        ...style,
        padding: 0,
        margin: 0,
        listStyle: 'none',
        display: expanded ? 'block' : 'none',
      },
    }),

    rootNodeChildren: {
      padding: 0,
      margin: 0,
      // TODO
      listStyle: 'none',
    },
  };
};

export default createStyling(getDefaultTheStyling, {
  defaultBase16: solarized,
});
