# eslint-plugin-vymo-ui

`eslint-plugin-vymo-ui` is a custom ESLint plugin designed to enforce import rules and other coding standards within your project.

## Install

To install the plugin, run the following command in your project directory:

```bash
yarn add eslint-plugin-vymo-ui

```

## Use

To start using the plugin, import it into your .eslintrc.json or other ESLint configuration file:

```json
{
  "plugins": ["vymo-ui"],
  "rules": {
    "vymo-ui/restrict-import": [
      "error",
      {
        "rootAlias": "src",
        "universalAllow": [],
        "universalDisallow": [],
        "rules": {
          "@vymo/ui/atoms": {
            "relativeImportDepth": 1,
            "allow": ["src/workspace/utils"],
            "disallow": []
          }
          // Add other folder rules here
        }
      }
    ]
  }
}
```

## Rules

- ## restrict-import

  The restrict-import rule is used to manage and enforce import restrictions within your project's folder structure. It helps to maintain a clean and organized codebase by allowing or disallowing specific paths for different folders.

  ### Options

  - **`rootAlias`** (`string`): The base folder where the code resides.
  - **`universalAllow`** (`Array<string>`): Paths allowed universally for all folders specified in the rules.
  - **`universalDisallow`** (`Array<string>`): Paths disallowed universally for all folders specified in the rules.
  - **`rules`**: An object where folder names like `atoms` can be specified. Each folder can have its own `allow` and `disallow` properties.
    - `relativeImportDepth`: It determines the maximum level till relative imports allowed. For ex, when `relativeImportDepth` is set to 1, it means relative imports till 1 level depth are allowed from given folder path.

  ### Example Config

  ```json
  {
    "rootAlias": "src",
    "universalAllow": [],
    "universalDisallow": [],
    "rules": {
      "@vymo/ui/atoms": {
        "allow": ["src/workspace/utils"],
        "disallow": []
      },
      "@vymo/ui/blocks": {
        "allow": ["src/@vymo/ui/atoms", "src/workspace/utils"],
        "disallow": []
      },
      "@vymo/ui/molecules": {
        "relativeImportDepth": 2,
        "allow": [
          "src/@vymo/ui/atoms",
          "src/@vymo/ui/blocks",
          "src/workspace/utils"
        ],
        "disallow": []
      },
      "@vymo/ui/components": {
        "relativeImportDepth": 1,
        "allow": [
          "src/@vymo/ui/atoms",
          "src/@vymo/ui/blocks",
          "src/@vymo/ui/molecules",
          "src/workspace/utils"
        ],
        "disallow": []
      }
    }
  }
  ```

- ## enforce-component-export-style

This rule enforces consistent patterns for React component exports, particularly when using `memo` and `forwardRef`. It ensures clean and maintainable component declarations by separating the component definition from its export statement.

### Valid Examples:

```tsx
// Separate declaration and export with memo/forwardRef
const Component = forwardRef((props, ref) => <div ref={ref} />);
export default memo(Component);

// Simple functional component
const Input = () => <div />;
export default Input;
```

### Invalid Examples:

```tsx
// Inline memo(forwardRef()) in export
export default memo(forwardRef((props, ref) => <div ref={ref} />));

// Combined memo(forwardRef()) assignment
const Test = memo(forwardRef((props, ref) => <input ref={ref} />));
export default Test;
```

## Test

```bash
yarn test
```

This will execute the test suite to ensure that the plugin is functioning as expected.

## Publish

```bash
yarn publish
```

make sure to bump the version in package.json
