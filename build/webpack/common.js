// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
"use strict";

const glob = require("glob");
const path = require("path");
const constants = require("../constants");
exports.nodeModulesToExternalize = [
  "unicode/category/Lu",
  "unicode/category/Ll",
  "unicode/category/Lt",
  "unicode/category/Lo",
  "unicode/category/Lm",
  "unicode/category/Nl",
  "unicode/category/Mn",
  "unicode/category/Mc",
  "unicode/category/Nd",
  "unicode/category/Pc",
  "@jupyterlab/services",
  "fontkit",
  "png-js",
];
exports.nodeModulesToReplacePaths = [...exports.nodeModulesToExternalize];
function getDefaultPlugins(name) {
  const plugins = [];
  return plugins;
}
exports.getDefaultPlugins = getDefaultPlugins;
function getListOfExistingModulesInOutDir() {
  const outDir = path.join(constants.ExtensionRootDir, "out", "client");
  const files = glob.sync("**/*.js", { sync: true, cwd: outDir });
  return files.map((filePath) => `./${filePath.slice(0, -3)}`);
}
exports.getListOfExistingModulesInOutDir = getListOfExistingModulesInOutDir;
