// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

const fs = require('fs-extra');
const { EOL } = require('os');
const path = require('path');
const dirName = __dirname;

function ignoreTSErrors(relativePath) {
    var filePath = path.join(dirName, '..', relativePath);
    if (!fs.existsSync(filePath)) {
        throw new Error("Typescript4 fixup not found '" + filePath + "' (pvsc post install script)");
    }
    var fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
    if (fileContents && !fileContents.includes('// @ts-nocheck')) {
        fs.writeFileSync(filePath, `// @ts-nocheck${EOL}${fileContents}`, { encoding: 'utf-8' });
    }
}

ignoreTSErrors('node_modules/@jupyterlab/codeeditor/lib/editor.d.ts');
