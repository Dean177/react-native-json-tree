module.exports = {
  extends: 'react-native',
  // ESLint doesn't find React Native components
  // Remove this setting when this issue is fixed.
  // https://github.com/facebook/react-native/issues/28549
  'import/ignore': ['react-native'],
};
