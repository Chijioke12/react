export default {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': false, // Firefox 48 supports variables
        'nesting-rules': true
      }
    },
    'autoprefixer': {
      flexbox: 'no-2009',
    },
    'cssnano': {
      preset: 'default',
    },
  },
};
