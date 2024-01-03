# Camp Coach

[![Netlify Status](https://api.netlify.com/api/v1/badges/1d06be2d-758d-4b29-b57f-8bb1a1eb5ecf/deploy-status)](https://app.netlify.com/sites/camp-coach/deploys)

## TODOs

- Run validation to make sure there are no overlapping dates
- Setup wizard to select total number of
  - camping dates / events / weekend gapping
  - start / end of yearly camping window
- Add "type" to events (Federal / California) and adjust book date rules accordingly
- Add "tags" to events + search / filtering

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
