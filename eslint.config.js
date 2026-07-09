'use strict';

const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const jsdocPlugin = require('eslint-plugin-jsdoc');
const noNullPlugin = require('eslint-plugin-no-null');
const preferArrowPlugin = require('eslint-plugin-prefer-arrow');
const noOnlyTestsPlugin = require('eslint-plugin-no-only-tests');
const prettierConfig = require('eslint-config-prettier');
const prettierTsConfig = require('eslint-config-prettier/@typescript-eslint');
const globals = require('globals');

module.exports = [
    {
        ignores: [
            'build/constants.js',
            'build/util.js',
            'build/ci/performance/checkPerformanceResults.js',
            'build/ci/performance/createNewPerformanceBenchmark.js',
            'build/ci/performance/savePerformanceResults.js',
            'build/webpack/plugins/less-plugin-base64.js',
            'build/webpack/pdfkit.js',
            'build/webpack/webpack.datascience-ui-viewers.config.js',
            'build/webpack/loaders/remarkLoader.js',
            'build/webpack/loaders/jsonloader.js',
            'build/webpack/loaders/externalizeDependencies.js',
            'build/tslint-rules/baseRuleWalker.js',
            'src/test/mocks/process.ts',
            'src/test/mocks/moduleInstaller.ts',
            'src/test/mocks/autoSelector.ts',
            'src/test/mocks/vsc/uuid.ts',
            'src/test/mocks/vsc/strings.ts',
            'src/test/mocks/vsc/charCode.ts',
            'src/test/mocks/vsc/htmlContent.ts',
            'src/test/mocks/vsc/position.ts',
            'src/test/mocks/vsc/telemetryReporter.ts',
            'src/test/mocks/vsc/range.ts',
            'src/test/mocks/vsc/arrays.ts',
            'src/test/smoke/common.ts',
            'src/test/smoke/runInTerminal.smoke.test.ts',
            'src/test/smoke/languageServer.smoke.test.ts',
            'src/test/textUtils.ts',
            'src/test/utils/fs.ts',
            'src/test/api.functional.test.ts',
            'src/test/common/configuration/service.test.ts',
            'src/test/common/moduleInstaller.test.ts',
            'src/test/common/misc.test.ts',
            'src/test/common/socketStream.test.ts',
            'src/test/common/configSettings.test.ts',
            'src/test/common/experiments/manager.unit.test.ts',
            'src/test/common/platform/platformService.test.ts',
            'src/test/common/platform/serviceRegistry.unit.test.ts',
            'src/test/common/platform/filesystem.functional.test.ts',
            'src/test/common/platform/filesystem.test.ts',
            'src/test/common/utils/version.unit.test.ts',
            'src/test/common/utils/workerPool.functional.test.ts',
            'src/test/common/configSettings/configSettings.pythonPath.unit.test.ts',
            'src/test/common/configSettings/configSettings.unit.test.ts',
            'src/test/common/featureDeprecationManager.unit.test.ts',
            'src/test/common/dotnet/compatibilityService.unit.test.ts',
            'src/test/common/dotnet/serviceRegistry.unit.test.ts',
            'src/test/common/dotnet/services/linuxCompatibilityService.unit.test.ts',
            'src/test/common/dotnet/services/winCompatibilityService.unit.test.ts',
            'src/test/common/dotnet/services/unknownOsCompatibilityService.unit.test.ts',
            'src/test/common/dotnet/services/macCompatibilityService.unit.test.ts',
            'src/test/common/serviceRegistry.unit.test.ts',
            'src/test/common/variables/environmentVariablesProvider.unit.test.ts',
            'src/test/common/nuget/nugetService.unit.test.ts',
            'src/test/common/nuget/azureBobStoreRepository.functional.test.ts',
            'src/test/common/nuget/nugetRepository.unit.test.ts',
            'src/test/common/nuget/azureBobStoreRepository.unit.test.ts',
            'src/test/common/helpers.test.ts',
            'src/test/common/installer/channelManager.unit.test.ts',
            'src/test/common/installer/condaInstaller.unit.test.ts',
            'src/test/common/installer/installer.unit.test.ts',
            'src/test/common/installer/pipInstaller.unit.test.ts',
            'src/test/common/installer/installer.invalidPath.unit.test.ts',
            'src/test/common/installer/moduleInstaller.unit.test.ts',
            'src/test/common/installer/pipEnvInstaller.unit.test.ts',
            'src/test/common/installer/productPath.unit.test.ts',
            'src/test/common/installer/serviceRegistry.unit.test.ts',
            'src/test/common/installer/poetryInstaller.unit.test.ts',
            'src/test/common/installer/extensionBuildInstaller.unit.test.ts',
            'src/test/common/socketCallbackHandler.test.ts',
            'src/test/common/installer.test.ts',
            'src/test/common/process/decoder.test.ts',
            'src/test/common/process/pythonToolService.unit.test.ts',
            'src/test/common/process/proc.observable.test.ts',
            'src/test/common/process/currentProcess.test.ts',
            'src/test/common/process/execFactory.test.ts',
            'src/test/common/process/proc.exec.test.ts',
            'src/test/common/process/pythonExecutionFactory.unit.test.ts',
            'src/test/common/asyncDump.ts',
            'src/test/common/interpreterPathService.unit.test.ts',
            'src/test/pythonFiles/formatting/dummy.ts',
            'src/test/format/extension.dispatch.test.ts',
            'src/test/format/extension.format.native.vscode.test.ts',
            'src/test/format/extension.onTypeFormat.test.ts',
            'src/test/format/extension.lineFormatter.test.ts',
            'src/test/format/extension.sort.test.ts',
            'src/test/format/extension.onEnterFormat.test.ts',
            'src/test/format/extension.format.test.ts',
            'src/test/format/format.helper.test.ts',
            'src/test/format/formatter.unit.test.ts',
            'src/test/debugger/common/protocolparser.test.ts',
            'src/test/debugger/envVars.test.ts',
            'src/test/startPage/startPage.unit.test.ts',
            'src/test/startPage/startPage.functional.test.tsx',
            'src/test/telemetry/.test.ts',
            'src/test/telemetry/envFileTelemetry.unit.test.ts',
            'src/test/telemetry/extensionInstallTelemetry.unit.test.ts',
            'src/test/application/misc/joinMailingListPrompt.unit.test.ts',
            'src/test/performance/load.perf.test.ts',
            'src/test/datascience/mockLanguageServerCache.ts',
            'src/test/datascience/data-viewing/dataViewerPDependencyService.unit.test.ts',
            'src/test/datascience/crossProcessLock.unit.test.ts',
            'src/test/datascience/mockLanguageServerAnalysisOptions.ts',
            'src/test/datascience/mockLanguageServerProxy.ts',
            'src/test/datascience/mockPythonSettings.ts',
            'src/test/datascience/datascienceSurveyBanner.unit.test.ts',
            'src/test/datascience/color.test.ts',
            'src/test/datascience/interactive-common/',
            'src/test/datascience/interactive-common/trustCommandHandler.unit.test.ts',
            'src/test/datascience/extensionapi/exampleextension/ms-toolsai-test/webpack.config.js',
            'src/test/datascience/extensionapi/exampleextension/ms-toolsai-test/.eslintrc.js',
            'src/test/datascience/extensionapi/exampleextension/ms-toolsai-test/src/typings/python.d.ts',
            'src/test/datascience/extensionapi/exampleextension/ms-toolsai-test/src/serverPicker.ts',
            'src/test/datascience/mockWorkspaceFolder.ts',
            'src/test/datascience/jupyterHelpers.ts',
            'src/test/datascience/kernelFinder.unit.test.ts',
            'src/test/datascience/mockLanguageClient.ts',
            'src/test/datascience/notebook/notebookTrust.native.vscode.test.ts',
            'src/test/datascience/notebook/survey.unit.test.ts',
            'src/test/datascience/notebook/interrupRestart.native.vscode.test.ts',
            'src/test/datascience/notebook/contentProvider.native.vscode.test.ts',
            'src/test/datascience/notebook/edit.native.vscode.test.ts',
            'src/test/datascience/notebook/saving.native.vscode.test.ts',
            'src/test/datascience/notebook/notebookEditorProvider.native.vscode.test.ts',
            'src/test/datascience/notebook/executionService.native.vscode.test.ts',
            'src/test/datascience/notebook/cellOutput.native.vscode.test.ts',
            'src/test/datascience/export/exportUtil.test.ts',
            'src/test/datascience/export/exportToHTML.test.ts',
            'src/test/datascience/export/exportToPython.test.ts',
            'src/test/datascience/export/exportManager.test.ts',
            'src/test/datascience/intellisense.unit.test.ts',
            'src/test/datascience/interactivePanel.functional.test.tsx',
            'src/test/datascience/jupyter/serverCache.unit.test.ts',
            'src/test/refactor/extension.refactor.extract.method.test.ts',
            'src/test/refactor/extension.refactor.extract.var.test.ts',
            'src/test/refactor/rename.test.ts',
            'src/test/workspaceSymbols/provider.unit.test.ts',
            'src/test/workspaceSymbols/common.ts',
            'src/test/workspaceSymbols/main.unit.test.ts',
            'src/test/workspaceSymbols/generator.unit.test.ts',
            'src/test/datascience/extensionapi/exampleextension/ms-ai-tools-test/src/serverPicker.ts'
        ]
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2015,
                ...globals.node
            },
            parser: tsParser,
            parserOptions: {
                project: ['tsconfig.json'],
                sourceType: 'module'
            },
            sourceType: 'module'
        },
        plugins: {
            jsdoc: jsdocPlugin,
            'no-null': noNullPlugin,
            'prefer-arrow': preferArrowPlugin,
            '@typescript-eslint': tsPlugin,
            'no-only-tests': noOnlyTestsPlugin
        },
        rules: {
            ...prettierConfig.rules,
            ...prettierTsConfig.rules,
            'no-only-tests/no-only-tests': ['error', { block: ['test', 'suite'], focus: ['only'] }],
            // Overriding ESLint rules with Typescript-specific ones
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-ignore': 'allow-with-description'
                }
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'no-bitwise': 'off',
            'no-dupe-class-members': 'off',
            '@typescript-eslint/no-dupe-class-members': 'error',
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': ['error'],
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_\\w*' }],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': [
                'error',
                {
                    functions: false
                }
            ],
            'no-useless-constructor': 'off',
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-floating-promises': 'error',

            // Other rules
            'class-methods-use-this': 'off',
            'func-names': 'off',
            'linebreak-style': 'off',
            'no-await-in-loop': 'off',
            'no-console': 'off',
            'no-control-regex': 'off',
            'no-extend-native': 'off',
            'no-multi-str': 'off',
            'no-param-reassign': 'off',
            'no-prototype-builtins': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ForInStatement',
                    message:
                        'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
                },

                {
                    selector: 'LabeledStatement',
                    message:
                        'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
                },
                {
                    selector: 'WithStatement',
                    message:
                        '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
                }
            ],
            'no-template-curly-in-string': 'off',
            'no-underscore-dangle': 'off',
            'no-useless-escape': 'off',
            'no-void': [
                'error',
                {
                    allowAsStatement: true
                }
            ],
            'operator-assignment': 'off',
            strict: 'off'
        },
        settings: {
            propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze']
        }
    }
];
