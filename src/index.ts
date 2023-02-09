// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as base from '@jupyter-widgets/base';
import * as widgets from '@jupyter-widgets/controls';
import * as outputWidgets from '@jupyter-widgets/jupyterlab-manager/lib/output';
import { WidgetManager } from './manager';

let loaded = false;
function load() {
    if (loaded) {
        console.warn('Already loaded ipywidgets7');
        return;
    }
	require('@lumino/widgets/style/index.css');
    require('@jupyter-widgets/base/css/index.css');
    require('@jupyter-widgets/controls/css/widgets.css');
    require('font-awesome/css/font-awesome.css');
    // Export the following for `requirejs`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty,@typescript-eslint/no-empty-function
    const define = (window as any).define || function () {};
    define('@jupyter-widgets/controls', () => widgets);
    define('@jupyter-widgets/base', () => base);
    define('@jupyter-widgets/output', () => outputWidgets);

    // Create our window export. Necessary for the ipywidget code loading in the output to find our widget manager
    // Jupyter extension will look for the WidgetManager in this object.

    // tslint:disable-next-line: no-any
    (window as any).vscIPyWidgets = {
        WidgetManager
    };
    loaded = true;
}
function unload() {
    if (!loaded) {
        return;
    }

    try {
        const undef = (window as any).undef || function () {};
        undef('@jupyter-widgets/controls');
        undef('@jupyter-widgets/base');
        undef('@jupyter-widgets/output');
        loaded = false;
    } catch (e) {
        console.warn(`Failed to unload IPYWidgets 7`, e);
    }
}

/**
 * Activate function is required by VS Code.
 */
export function activate() {
    // Expose an object with load and unload functions.
    // So that we can dynamically load and unload them.
    // This script file along with the ipywidgets 8 version will be loaded into the same webpage
    // However depending on the version of IPyWidgets we load only one of them.
    if (!(window as any).vscIPyWidgets7) {
        (window as any).vscIPyWidgets7 = {
            load,
            unload
        };
    }
}
