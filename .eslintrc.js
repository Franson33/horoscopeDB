module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2020,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    },
  },
  rules: {
    "quotes": ["error", "double"],
    "linebreak-style": 0,
    "operator-linebreak": ["error", "before"],
  },
};
