module.exports = function (api) {
  api.cache(true)

  const isProd = process.env.NODE_ENV === 'production'

  const presets = ['@babel/preset-react']
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
        regenerator: false,
        useESModules: true,
      },
    ],
    'module:react-hot-loader/babel',
  ]

  if (isProd) {
    presets.push([
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        useBuiltIns: 'usage',
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
      },
    ])
    plugins.push(
      [
        'module:fast-async',
        {
          compiler: {
            promises: true,
            generators: false,
          },
          runtimePattern: null,
          useRuntimeModule: false,
        },
      ],
      'transform-react-remove-prop-types',
      'lodash',
    )
  } else {
    plugins.push('@babel/plugin-syntax-object-rest-spread')
  }

  return {
    presets,
    plugins,
  }
}
