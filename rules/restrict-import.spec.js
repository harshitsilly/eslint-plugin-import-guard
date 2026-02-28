const path = require('path');
const RuleTester = require('eslint').RuleTester;
const rule = require('./restrict-import');

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const options = [
  {
    rootAlias: 'src',
    universalAllow: [
      'src/workspace/axios',
      'src/workspace/utils',
      'src/designTokens/themes',
      'src/assets',
      'src/logger',
      'src/hooks',
    ],
    universalDisallow: [],
    rules: {
      '@vymo/ui/atoms': {
        relativeImportDepth: 1,
        allow: ['src/@vymo/ui/atoms/*'],
        disallow: ['src/@vymo/ui/atoms'],
      },
      '@vymo/ui/blocks': {
        relativeImportDepth: 1,
        allow: ['src/@vymo/ui/blocks/', 'src/@vymo/ui/atoms'],
        disallow: ['src/@vymo/ui/blocks'],
      },
      '@vymo/ui/molecules': {
        relativeImportDepth: 1,
        allow: [
          'src/@vymo/ui/molecules/.+',
          'src/@vymo/ui/blocks',
          'src/@vymo/ui/atoms',
        ],
        disallow: [],
      },
      '@vymo/ui/components': {
        relativeImportDepth: 1,
        allow: [
          'src/@vymo/ui/molecules',
          'src/@vymo/ui/blocks',
          'src/@vymo/ui/atoms',
        ],
        disallow: [],
      },
      modules: {
        relativeImportDepth: 1,
        allow: [
          'src/@vymo/ui',
          'src/models',
          'src/store',
          'src/localStorage',
          'src/featureFlags',
          'src/workspace/slice',
          'src/modules/constants',
          'src/modules/types',
          'src/workspace/childComponent',
        ],
        disallow: [],
      },
    },
  },
];

ruleTester.run('restrict-imports', rule, {
  valid: [
    {
      filename: 'src/@vymo/ui/atoms/input/index.tsx',
      code: `import './types';`,
      options,
    },
    {
      filename: 'src/@vymo/ui/atoms/dateTime/datePicker/index.tsx',
      code: `import '../base';`,
      options,
    },
    {
      filename: 'src/@vymo/ui/atoms/input/index.tsx',
      code: `import React from 'react';`,
      options,
    },
    {
      filename: 'src/modules/auth/otp/index.tsx',
      code: `import Loader from 'src/@vymo/ui/atoms/loader'`,
      options,
    },
    {
      filename: 'src/workspace/noModuleAddPage.tsx',
      code: `import Divider from 'src/@vymo/ui/atoms/divider'`,
      options,
    },
    {
      filename: 'src/apps/recruitment/moduleReducerConfig.ts',
      code: `import AuthModule from 'src/modules/copilot/module'`,
      options,
    },
    {
      filename:
        'src/@vymo/ui/molecules/form/configMappingFormItemsGenerator/queries.ts',
      code: `import { REGEX_DECIMAL } from 'src/@vymo/ui/molecules/currencyAndDecimal/constant';`,
      options,
    },
  ],
  invalid: [
    {
      filename: 'src/modules/recruitment/index',
      code: `import 'src/modules/auth/queries';`,
      options,
      errors: [
        {
          message: "Import 'src/modules/auth/queries' is not allowed here.",
        },
      ],
    },
    {
      filename: 'src/@vymo/ui/atoms/input/index.tsx',
      code: `import { loader } from 'src/@vymo/ui/blocks';`,
      options,
      errors: [
        {
          message: "Import 'src/@vymo/ui/blocks' is not allowed here.",
        },
      ],
    },
    {
      filename: 'src/@vymo/ui/blocks/button/index.tsx',
      code: `import '../../atoms/input/types';`,
      options,
      errors: [
        {
          message:
            "Invalid relative import '../../atoms/input/types'. Can only import relative path within the 'button' directory. Try using absolute path with alias 'src/'",
        },
      ],
    },
    {
      filename: 'src/@vymo/ui/atoms/input/index.tsx',
      code: `import '../blocks/button';`,
      options,
      errors: [
        {
          message:
            "Invalid relative import '../blocks/button'. Can only import relative path within the 'input' directory. Try using absolute path with alias 'src/'",
        },
      ],
    },
    {
      filename: 'src/@vymo/ui/blocks/button/index.tsx',
      code: `import '../../components/header';`,
      options,
      errors: [
        {
          message:
            "Invalid relative import '../../components/header'. Can only import relative path within the 'button' directory. Try using absolute path with alias 'src/'",
        },
      ],
    },
    {
      filename: 'src/@vymo/ui/atoms/dateTime/datePicker/index.tsx',
      code: `import '../../base';`,
      options,
      errors: [
        {
          message:
            "Invalid relative import '../../base'. Can only import relative path within the 'dateTime' directory. Try using absolute path with alias 'src/'",
        },
      ],
    },

    {
      filename:
        'src/@vymo/ui/molecules/form/configMappingFormItemsGenerator/queries.ts',
      code: `import { REGEX_DECIMAL } from 'src/@vymo/ui/molecules';`,
      options,
      errors: [
        {
          message: "Import 'src/@vymo/ui/molecules' is not allowed here.",
        },
      ],
    },
  ],
});
