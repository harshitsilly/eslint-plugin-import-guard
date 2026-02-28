module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce consistent React component export patterns',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      noInlineMemoForwardRef:
        'Avoid using memo(forwardRef()) directly in export. Define the component with forwardRef first , then export it with memo.',
      noInlineMemoForwardRefAssign:
        'Avoid assigning memo(forwardRef()) directly to a variable. Define the component with forwardRef first, then export it with memo.',
    },
    schema: [], // no options
  },
  create(context) {
    function isMemo(node) {
      return (
        (node.type === 'Identifier' && node.name === 'memo') ||
        (node.type === 'MemberExpression' &&
          node.object.name === 'React' &&
          node.property.name === 'memo')
      );
    }

    function isForwardRef(node) {
      return (
        (node.type === 'Identifier' && node.name === 'forwardRef') ||
        (node.type === 'MemberExpression' &&
          node.object.name === 'React' &&
          node.property.name === 'forwardRef')
      );
    }

    function isNestedMemoForwardRef(node) {
      if (node.type !== 'CallExpression') return false;

      const isMemoCall = isMemo(node.callee);
      if (!isMemoCall || !node.arguments[0]) return false;

      const firstArg = node.arguments[0];
      if (firstArg.type !== 'CallExpression') return false;

      return isForwardRef(firstArg.callee);
    }

    return {
      // Check export default statements
      ExportDefaultDeclaration(node) {
        if (
          node.declaration.type === 'CallExpression' &&
          isNestedMemoForwardRef(node.declaration)
        ) {
          context.report({
            node,
            messageId: 'noInlineMemoForwardRef',
          });
        }
      },

      // Check variable declarations
      VariableDeclarator(node) {
        if (node.init && isNestedMemoForwardRef(node.init)) {
          context.report({
            node,
            messageId: 'noInlineMemoForwardRefAssign',
          });
        }
      },
    };
  },
};
