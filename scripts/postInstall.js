// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

const fs = require('fs-extra');
const { EOL } = require('os');
const path = require('path');
const dirName = __dirname;

function fixJupyterLabRenderers() {
    const warnings = [];
    ['node_modules/@jupyterlab/cells/lib/widget.js', 'node_modules/@jupyterlab/rendermime/lib/renderers.js'].forEach(
        (file) => {
            const filePath = path.join(__dirname, '..', file);
            if (!fs.existsSync(filePath)) {
                return;
            }
            const textToReplace = `import marked from 'marked'`;
            const textToReplaceWith = `import { marked } from 'marked'`;
            const fileContents = fs.readFileSync(filePath, 'utf8').toString();
            if (fileContents.indexOf(textToReplace) === -1 && fileContents.indexOf(textToReplaceWith) === -1) {
                warnings.push('Unable to find Jupyter marked usage to replace!');
            }
            fs.writeFileSync(filePath, fileContents.replace(textToReplace, `import { marked } from 'marked'`));
        }
    );
    if (warnings.length === 2) {
        throw new Error(warnings[0] + '\n' + warnings[1]);
    }
}
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

fixJupyterLabRenderers();
ignoreTSErrors('node_modules/@jupyterlab/codeeditor/lib/editor.d.ts');
