module.exports = {
    "extends": [
      "plugin:@typescript-eslint/recommended"
    ],
    "env": {
      "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint/eslint-plugin"
    ],
    "rules": {
      "no-explicit-any": 0,
    }
  };