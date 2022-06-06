// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as base from '@jupyter-widgets/base';
import * as widgets from '@jupyter-widgets/controls';
import * as outputWidgets from '@jupyter-widgets/jupyterlab-manager/lib/output';
import * as embed from './embed';
import { WidgetManager } from './manager';
import './widgets.css';

type KernelMessagingApi = {
    postKernelMessage: (data: unknown) => void;
};

// Default logger is console.log
let logger = console.log;

// Export the following for `requirejs`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty,@typescript-eslint/no-empty-function
const define = (window as any).define || function () {};
define('@jupyter-widgets/controls', () => widgets);
define('@jupyter-widgets/base', () => base);
define('@jupyter-widgets/output', () => outputWidgets);

// Render existing widgets without a kernel and pull in the correct css files
// This is not done yet. See this issue here: https://github.com/microsoft/vscode-python/issues/10794
// Likely we'll do this in a different spot.
if (document.readyState === 'complete') {
    embed.renderWidgets(document.documentElement, logger);
} else {
    window.addEventListener('load', () => {
        embed.renderWidgets(document.documentElement, logger);
    });
}

// Create our window export. Necessary for the ipywidget code loading in the output to find our widget manager
// tslint:disable-next-line: no-any
(window as any).vscIPyWidgets = {
    WidgetManager
};

// Has to be this form for VS code to load it correctly
export function activate(context?: KernelMessagingApi) {
    // Setup the logger function
    if (context) {
        logger = (msg) => {
            context.postKernelMessage({
                type: 'IPyWidgets_logMessage',
                payload: msg
            });
        };
    }
}
