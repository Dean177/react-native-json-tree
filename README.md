# react-native-json-tree

React Native JSON Viewer Component, based on [react-json-tree](https://github.com/alexkuz/react-json-tree). Supports [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable) objects, such as [Immutable.js](https://facebook.github.io/immutable-js/).

![](https://img.shields.io/npm/v/react-native-json-tree.svg)

### Usage

```jsx
import JSONTree from 'react-native-json-tree'
// If you're using Immutable.js: `npm i --save immutable`
import { Map } from 'immutable'

// Inside a React component:
const json = {
  array: [1, 2, 3],
  bool: true,
  object: {
    foo: 'bar'
  }
  immutable: Map({ key: 'value' })
}

<JSONTree data={json} />
```

#### Result:

![](http://cl.ly/image/3f2C2k2t3D0o/screenshot%202015-08-26%20at%2010.24.12%20AM.png)

Check out the [Example](Example) directory.

### Theming

This component now uses [react-base16-styling](https://github.com/alexkuz/react-base16-styling) module, which allows to customize component via `theme` property, which can be the following:
- [base16](http://chriskempson.github.io/base16) theme data. [The example theme data can be found here](https://github.com/gaearon/redux-devtools/tree/75322b15ee7ba03fddf10ac3399881e302848874/src/react/themes).
- object that contains style objects, strings (that treated as classnames) or functions. A function is used to extend its first argument `{ style, className }` and should return an object with the same structure. Other arguments depend on particular context (and should be described here). See [createStylingFromTheme.js](https://github.com/alexkuz/react-json-tree/blob/feature-refactor-styling/src/createStylingFromTheme.js) for the list of styling object keys. Also, this object can extend `base16` theme via `extend` property.

Every theme has a light version, which is enabled with `invertTheme` prop.

```jsx
const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

<JSONTree data={data} theme={theme} invertTheme={false} />

```

#### Result (Monokai theme, dark background):

![](http://cl.ly/image/330o2L1J3V0h/screenshot%202015-08-26%20at%2010.48.24%20AM.png)

#### Advanced Customization

```jsx
<JSONTree data={data} theme={{
  extend: theme,
  // underline keys for literal values
  valueLabel: {
    textDecoration: 'underline'
  },
  // switch key for objects to uppercase when object is expanded.
  // `nestedNodeLabel` receives additional arguments `expanded` and `keyPath`
  nestedNodeLabel: ({ style }, nodeType, expanded) => ({
    style: {
      ...style,
      textTransform: expanded ? 'uppercase' : style.textTransform
    }
  })
}} />
```

#### Customize Labels for Arrays, Objects, and Iterables

You can pass `getItemString` to customize the way arrays, objects, and iterable nodes are displayed (optional).

By default, it'll be:

```jsx
<JSONTree getItemString={(type, data, itemType, itemString) =>
  <Text>{itemType} {itemString}</Text>}
/>
```

But if you pass the following:

```jsx
const getItemString = (type, data, itemType, itemString) =>
  <Text>{type}</Text>;
```

Then the preview of child elements now look like this:

![](http://cl.ly/image/1J1a0b0T0K3c/screenshot%202015-10-07%20at%203.44.31%20PM.png)

#### Customize Rendering

You can pass the following properties to customize rendered labels and values:

```jsx
<JSONTree
  labelRenderer={raw => <Text style={{ fontWeight: 'bold' }}>{raw}</Text>}
  valueRenderer={raw => <Text style={{ fontStyle: 'italic' }}>{raw}</Text>}
/>
```

In this example the label and value will be rendered with bold and italic text respectively.

For `labelRenderer`, you can provide a full path - [see this PR](https://github.com/alexkuz/react-json-tree/pull/32).

#### More Options

- `shouldExpandNode: (keyName, data, level) => boolean` - determines if node should be expanded (root is expanded by default)
- `hideRoot: boolean` - if `true`, the root node is hidden.
- `sortObjectKeys: boolean | (a, b) => number` - sorts object keys with compare function (optional). Isn't applied to iterable maps like `Immutable.Map`.

### Credits

- [alexkuz](https://github.com/alexkuz/) for [react-json-tree](https://github.com/alexkuz/react-json-tree)

### License

MIT
