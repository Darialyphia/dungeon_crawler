module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-undef": "off",
    "no-redeclare": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-setup-props-destructure": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
};
