# eslint-plugin-import-guard

`eslint-plugin-import-guard` is a custom ESLint plugin designed to enforce import rules and maintain clean, organized codebases by controlling how modules can import from each other within your project structure.

## Features

- **Restrict Imports**: Control which folders can import from which other folders
- **Component Export Style**: Enforce consistent React component export patterns
- **Flexible Configuration**: Support for universal rules and folder-specific rules
- **Relative Import Control**: Limit the depth of relative imports

## Installation

To install the plugin, run the following command in your project directory:

```bash
yarn add eslint-plugin-import-guard
```

## Usage

To start using the plugin, import it into your `.eslintrc.json` or other ESLint configuration file:

```json
{
  "plugins": ["import-guard"],
  "rules": {
    "import-guard/restrict-import": [
      "error",
      {
        "rootAlias": "src",
        "universalAllow": [],
        "universalDisallow": [],
        "rules": {
          "@ds/atoms": {
            "relativeImportDepth": 1,
            "allow": ["src/workspace/utils"],
            "disallow": []
          }
        }
      }
    ]
  }
}
```

## Rules

### restrict-import

The `restrict-import` rule is used to manage and enforce import restrictions within your project's folder structure. It helps maintain a clean and organized codebase by allowing or disallowing specific paths for different folders.

#### Options

- **`rootAlias`** (`string`): The base folder where the code resides (e.g., "src")
- **`universalAllow`** (`Array<string>`): Paths allowed universally for all folders specified in the rules
- **`universalDisallow`** (`Array<string>`): Paths disallowed universally for all folders specified in the rules
- **`rules`**: An object where folder names can be specified. Each folder can have its own `allow`, `disallow`, and `relativeImportDepth` properties:
  - `relativeImportDepth`: Maximum level of relative imports allowed (0 = no relative imports, 1 = one level deep, etc.)
  - `allow`: Array of paths that are allowed to be imported
  - `disallow`: Array of paths that are explicitly disallowed

#### Example Configuration

```json
{
  "rootAlias": "src",
  "universalAllow": [],
  "universalDisallow": [],
  "rules": {
    "atoms": {
      "relativeImportDepth": 1,
      "allow": ["src/workspace/utils"],
      "disallow": []
    },
    "blocks": {
      "allow": ["src/@ds/atoms", "src/workspace/utils"],
      "disallow": []
    },
    "molecules": {
      "relativeImportDepth": 2,
      "allow": [
        "src/@ds/atoms",
        "src/@ds/blocks",
        "src/workspace/utils"
      ],
      "disallow": []
    },
    "components": {
      "relativeImportDepth": 1,
      "allow": [
        "src/@ds/atoms",
        "src/@ds/blocks",
        "src/@ds/molecules",
        "src/workspace/utils"
      ],
      "disallow": []
    }
  }
}
```

#### Practical Examples

**Valid Import Scenarios:**

```javascript
// From @ds/atoms (relativeImportDepth: 1)
import { utility } from '../workspace/utils'; // Valid - 1 level deep
import { Button } from './Button'; // Valid - same folder

// From @ds/blocks (no relativeImportDepth specified)
import { Button } from '@ds/atoms'; // Valid - allowed in config
import { utility } from '../workspace/utils'; // Valid - allowed in config

// From @ds/molecules (relativeImportDepth: 2)
import { Button } from '../../@ds/atoms'; // Valid - 2 levels deep
import { Card } from '../blocks'; // Valid - 1 level deep
```

**Invalid Import Scenarios:**

```javascript
// From @ds/atoms (relativeImportDepth: 1)
import { utility } from '../../workspace/utils'; // Invalid - too deep
import { Card } from '../molecules'; // Invalid - not allowed

// From @ds/components (relativeImportDepth: 1)
import { Button } from '../../../@ds/atoms'; // Invalid - too deep
```

### enforce-component-export-style

This rule enforces consistent patterns for React component exports, particularly when using `memo` and `forwardRef`. It ensures clean and maintainable component declarations by separating the component definition from its export statement.

#### Options

- **`allowInlineMemo`** (`boolean`): Allow inline `memo()` usage in exports (default: `false`)
- **`allowInlineForwardRef`** (`boolean`): Allow inline `forwardRef()` usage in exports (default: `false`)
- **`allowMixedExports`** (`boolean`): Allow mixing default and named exports (default: `false`)
- **`requireSeparateDeclaration`** (`boolean`): Require component declaration to be separate from export (default: `true`)

#### Valid Examples:

```tsx
// Default configuration (requireSeparateDeclaration: true)
const Component = forwardRef((props, ref) => <div ref={ref} />);
export default memo(Component);

// With allowInlineMemo: true
export default memo(forwardRef((props, ref) => <div ref={ref} />));

// With allowMixedExports: true
const Component = () => <div />;
export default Component;
export { Component };

// With allowInlineForwardRef: true
export default forwardRef((props, ref) => <div ref={ref} />);
```

#### Invalid Examples:

```tsx
// Default configuration (requireSeparateDeclaration: true)
export default memo(forwardRef((props, ref) => <div ref={ref} />)); // Invalid

// With allowMixedExports: false
const Component = () => <div />;
export default Component;
export { Component }; // Invalid

// With allowInlineMemo: false
export default memo(forwardRef((props, ref) => <div ref={ref} />)); // Invalid
```

#### Valid Examples:

```tsx
// Separate declaration and export with memo/forwardRef
const Component = forwardRef((props, ref) => <div ref={ref} />);
export default memo(Component);

// Simple functional component
const Input = () => <div />;
export default Input;

// Component with multiple exports
const Button = ({ children }) => <button>{children}</button>;
const ButtonWithIcon = ({ icon, children }) => (
  <button>
    {icon}
    {children}
  </button>
);
export { Button, ButtonWithIcon };
export default Button;
```

#### Invalid Examples:

```tsx
// Inline memo(forwardRef()) in export
export default memo(forwardRef((props, ref) => <div ref={ref} />));

// Combined memo(forwardRef()) assignment
const Test = memo(forwardRef((props, ref) => <input ref={ref} />));
export default Test;

// Mixed export patterns
const Component = () => <div />;
export default memo(Component);
export { Component }; // Invalid - mixing default and named exports
```

## Testing

To run the test suite and ensure the plugin is functioning as expected:

```bash
yarn test
```

## Publishing

To publish a new version of the plugin:

```bash
yarn publish
```

Make sure to bump the version in `package.json` before publishing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
