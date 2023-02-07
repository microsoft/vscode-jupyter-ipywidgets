// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as base from '@jupyter-widgets/base';
import * as widgets from '@jupyter-widgets/controls';
import * as outputWidgets from '@jupyter-widgets/jupyterlab-manager/lib/output';
import { WidgetManager } from './manager';

let loaded = false;
function load() {
    if (loaded) {
        console.warn('Already loaded ipywidgets8');
        return;
    }
    require('./widgets.css');
    require('../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
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
        console.warn(`Failed to unload IPYWidgets 8`, e);
    }
}

export function activate() {
    // Expose an object with load and unload functions.
    // So that we can dynamically load and unload them.
    // This script file along with the ipywidgets 8 version will be loaded into the same webpage
    // However depending on the version of IPyWidgets we load only one of them.
    if (!(window as any).vscIPyWidgets8) {
        (window as any).vscIPyWidgets8 = {
            load,
            unload
        };
    }
}
