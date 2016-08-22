import { createStyling } from '../lib/react-base16-styling';
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
      padding: 5,
    },

    value: ({ style }) => ({
      style: {
        flexDirection: 'row',
        marginLeft: 10,
        ...style,
      },
    }),

    label: {
      color: colors.LABEL_COLOR,
      flexDirection: 'row',
    },

    valueLabel: {
      marginBottom: 8,
    },

    valueText: ({ style }, nodeType) => ({
      style: {
        color: valueColorMap(colors)[nodeType],
        marginLeft: 5,
        ...style,
      },
    }),

    itemRange: ({ style }, expanded) => ({
      style: {
        paddingTop: expanded ? 5 : 0,
        paddingLeft: expanded ? 10 : 0,
      },
    }),

    itemText: ({ style }, expanded) => ({
      style: {
        paddingTop: expanded ? 5 : 5,
        paddingLeft: expanded ? 10 : 15,
        color: colors.LABEL_COLOR,
      },
    }),

    arrow: ({ style }, nodeType, expanded) => ({
      style: {
        fontSize: 15,
        marginLeft: 0,
        transform: expanded ? [{ rotate: '90deg' }] : [{ rotate: '0deg' }],
        ...style,
      },
    }),

    arrowContainer: ({ style }, arrowStyle) => ({
      style: {
        flexDirection: 'row',
        paddingLeft: arrowStyle === 'double' ? 5 : 0,
        paddingRight: 3,
        ...style,
      },
    }),

    arrowSign: { color: colors.ARROW_COLOR },

    nestedNode: ({ style }, keyPath, nodeType, expanded, expandable) => ({
      style: {
        marginLeft: keyPath.length > 1 ? 7 : 0,
        paddingBottom: 5,
        paddingLeft: expandable ? 0 : 3,
        ...style,
      },
    }),

    nestedNodeLabel: ({ style }) => ({ style }),

    nestedNodeItemString: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        color: expanded ? colors.ITEM_STRING_EXPANDED_COLOR : colors.ITEM_STRING_COLOR,
        marginLeft: 5,
        ...style,
      },
    }),

    nestedNodeChildren: ({ style }) => ({
      style: {
        marginLeft: 10,
        ...style,
      },
    }),
  };
};

export default createStyling(getDefaultTheStyling, {
  defaultBase16: solarized,
});
