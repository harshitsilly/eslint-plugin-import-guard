const { RuleTester } = require('eslint');
const rule = require('./enforce-component-export-style');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('enforce-component-export-style', rule, {
  valid: [
    // Test case 1: Separate declaration and export with memo and forwardRef
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        const Component = forwardRef((props, ref) => <div ref={ref} />);
        export default memo(Component);
      `,
    },
    // Test case 2: Simple functional component export
    {
      code: `
        import React from 'react';
        const Input = () => <div />;
        export default Input;
      `,
    },
    // Test case 3: Using React.memo and React.forwardRef separately
    {
      code: `
        import React from 'react';
        const Button = React.forwardRef((props, ref) => <button ref={ref} />);
        export default React.memo(Button);
      `,
    },
  ],
  invalid: [
    // Test case 1: Inline memo(forwardRef()) in export
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        export default memo(forwardRef((props, ref) => <div ref={ref} />));
      `,
      errors: [{ messageId: 'noInlineMemoForwardRef' }],
    },
    // Test case 2: Direct assignment with memo(forwardRef())
    {
      code: `
        import React, { memo, forwardRef } from 'react';
        const Test = memo(forwardRef((props, ref) => <input ref={ref} />));
        export default Test;
      `,
      errors: [{ messageId: 'noInlineMemoForwardRefAssign' }],
    },
    // Test case 3: Using React.memo and React.forwardRef inline
    {
      code: `
        import React from 'react';
        export default React.memo(React.forwardRef((props, ref) => <div ref={ref} />));
      `,
      errors: [{ messageId: 'noInlineMemoForwardRef' }],
    },
  ],
});
