import { createStyling } from 'react-base16-styling';
import solarized from './themes/solarized';

const colorMap = theme => ({
  ARROW_COLOR: theme.base0D,
  BACKGROUND_COLOR: theme.base00,
  BOOLEAN_COLOR: theme.base09,
  DATE_COLOR: theme.base0B,
  FUNCTION_COLOR: theme.base08,
  ITEM_STRING_COLOR: theme.base0B,
  ITEM_STRING_EXPANDED_COLOR: theme.base03,
  LABEL_COLOR: theme.base0D,
  NUMBER_COLOR: theme.base09,
  NULL_COLOR: theme.base08,
  STRING_COLOR: theme.base0B,
  SYMBOL_COLOR: theme.base08,
  TEXT_COLOR: theme.base07,
  UNDEFINED_COLOR: theme.base08,
});

const valueColorMap = colors => ({
  Boolean: colors.BOOLEAN_COLOR,
  Date: colors.DATE_COLOR,
  Function: colors.FUNCTION_COLOR,
  Number: colors.NUMBER_COLOR,
  Null: colors.NULL_COLOR,
  String: colors.STRING_COLOR,
  Symbol: colors.SYMBOL_COLOR,
  Undefined: colors.UNDEFINED_COLOR,
});

const getStylingFromBase16 = (base16Theme) => {
  const colors = colorMap(base16Theme);

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
        paddingLeft: expanded ? 10 : 0,
        paddingTop: expanded ? 5 : 0,
      },
    }),

    itemText: ({ style }, expanded) => ({
      style: {
        color: colors.LABEL_COLOR,
        paddingLeft: expanded ? 10 : 15,
        paddingTop: expanded ? 5 : 5,
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

const createStylingFromTheme = createStyling(getStylingFromBase16, {
  defaultBase16: solarized,
});

export default createStylingFromTheme;
