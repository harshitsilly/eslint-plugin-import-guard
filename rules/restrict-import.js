const path = require('path');

function getFolderLevelDir(filepath, rootAlias, folderIndex = 1) {
  const parts = filepath.split(path.sep);
  const index = parts.indexOf(rootAlias);
  return parts[index + folderIndex];
}

function isValidRelativeImport(importPath, filename, folderLevelDir) {
  const importFilePath = path.resolve(
    path.dirname(filename),
    path.resolve(path.dirname(filename), importPath),
  );
  return importFilePath.indexOf(`/${folderLevelDir}/`) > -1;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Restrict imports according to folder structure with configurable rules',
      category: 'Best Practices',
    },
    schema: [
      {
        type: 'object',
        properties: {
          rootAlias: {
            type: 'string',
            description: 'The alias used for the src directory (e.g., "src")',
          },
          universalAllow: {
            type: 'array',

            items: { type: 'string' },
          },

          universalDisallow: {
            type: 'array',

            items: { type: 'string' },
          },
          rules: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                relativeImportDepth: { type: 'number' },
                allow: { type: 'array', items: { type: 'string' } },
                disallow: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
          },
        },
        required: ['rootAlias', 'rules'],
        additionalProperties: false,
      },
    ],
  },
  create: function (context) {
    const options = context.options[0];
    const { rootAlias, universalAllow, universalDisallow, rules } = options;

    function checkImport(node, importPath, filename) {
      if (!importPath) {
        return;
      }

      if (
        !importPath.startsWith('.') && // Not a relative path
        !importPath.startsWith('/') && // Not an absolute path
        !importPath.startsWith(`${rootAlias}/`) // Not a direct import from rootAlias
      ) {
        return; // Skip checking for node_modules imports
      }

      const filenameWithoutAlias = filename.split(rootAlias)[1];

      if (!filenameWithoutAlias) {
        return;
      }

      const ruleKey = Object.keys(rules).find(
        (rule) => filenameWithoutAlias.indexOf(path.join('/', rule, '/')) > -1,
      );

      if (!ruleKey) {
        return;
      }

      const ruleConfig = rules[ruleKey];

      if (!ruleConfig) {
        return;
      }

      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const folderNestedLength = ruleKey.split(path.sep).length;
        const fileDepthAllowed =
          folderNestedLength + (ruleConfig.relativeImportDepth ?? 0);

        const folderLevelDir = getFolderLevelDir(
          filename,
          rootAlias,
          fileDepthAllowed,
        );

        if (!isValidRelativeImport(importPath, filename, folderLevelDir)) {
          context.report({
            node,
            message: `Invalid relative import '${importPath}'. Can only import relative path within the '${folderLevelDir}' directory. Try using absolute path with alias 'src/'`,
          });
          return;
        }
      } else if (importPath.startsWith(`${rootAlias}/`)) {
        const isAllowed = [...ruleConfig.allow, ...universalAllow].some(
          (pattern) => new RegExp(pattern).test(importPath),
        );

        const isDisallowed = [
          ...ruleConfig.disallow,
          ...universalDisallow,
        ].some((pattern) => new RegExp(pattern).test(importPath));

        if (!isAllowed || isDisallowed) {
          context.report({
            node,
            message: `Import '${importPath}' is not allowed here.`,
          });
        }
      }
    }

    return {
      ImportDeclaration(node) {
        const filename = context.getFilename();
        checkImport(node, node.source.value, filename);
      },
      CallExpression(node) {
        if (node.callee.name === 'require' && node.arguments.length > 0) {
          const filename = context.getFilename();
          checkImport(node, node.arguments[0].value, filename);
        }
      },
    };
  },
};
