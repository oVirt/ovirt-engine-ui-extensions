module.exports = {
  root: true,
  parser: '@babel/eslint-parser',

  extends: [
    'standard',
    'standard-react',
  ],

  plugins: [
    '@babel',
    'import',
    'react',
    'react-hooks',
  ],

  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      configFile: './.babelrc.js',
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  globals: {
    __DEV__: false,
  },

  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'generator-star-spacing': ['error', { 'before': false, 'after': true }],
    'no-duplicate-imports': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prefer-object-spread': 'error',

    // quotes in properties where quote aren't needed should be ok
    'quote-props': 'off',

    // be picky about ternary multiline and indents
    'multiline-ternary': ['error', 'always-multiline'],

    // modified from eslint-config-standard for ternary expressions
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        ignoreComments: false,
        ignoredNodes: [
          'TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier',
          'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer',
          'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment',
          'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild',
        ],

        flatTernaryExpressions: true,
        offsetTernaryExpressions: false,
      },
    ],

    'import/no-duplicates': 'error',

    // ref: https://github.com/yannickcr/eslint-plugin-react
    // basic react and jsx rules
    'react/no-unsafe': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/jsx-uses-react': 'warn',
    'react/jsx-fragments': ['warn', 'syntax'],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-pascal-case': ['warn', { allowAllCaps: true, ignore: [] }],

    // JSX formatting, indents and multiline rules:
    'react/jsx-closing-tag-location': 'warn',
    'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
    'react/jsx-indent': ['warn', 2, { checkAttributes: true, indentLogicalExpressions: true }],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-wrap-multilines': [
      'warn',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
}
