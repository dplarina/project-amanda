module.exports = {
  root: true,
  env: {
    browser: true,
    amd: true,
    node: true
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports,
  },
  extends: [
    'semistandard',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['dist/', 'bin/', 'obj/', 'node_modules/', 'packages/', '.yarn/'],
  rules: {
    indent: 'off',
    'multiline-ternary': 1,
    'import/no-webpack-loader-syntax': 'off',
    'space-before-function-paren': 'off',
    // note you must disable the base rule as it can report incorrect errors
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    '@typescript-eslint/no-this-alias': [
      2,
      {
        allowDestructuring: true, // Allow `const { props, state } = this`; false by default
        allowedNames: ['self', '$ctrl', 'froala'] // Allow `const self = this`; `[]` by default
      }
    ]
  }
};
