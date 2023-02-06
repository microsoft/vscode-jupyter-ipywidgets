// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as base from '@jupyter-widgets/base';
import * as widgets from '@jupyter-widgets/controls';
import * as outputWidgets from '@jupyter-widgets/jupyterlab-manager/lib/output';
import { WidgetManager } from './manager';
import './widgets.css';

let loaded = false;
function load() {
    if (loaded) {
        console.warn('Already loaded ipywidgets8');
        return;
    }
    console.error('Initializing ipywidgets8');
    // Export the following for `requirejs`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty,@typescript-eslint/no-empty-function
    const define = (window as any).define || function () {};
    define('@jupyter-widgets/controls', () => widgets);
    define('@jupyter-widgets/base', () => base);
    define('@jupyter-widgets/output', () => outputWidgets);

    // Create our window export. Necessary for the ipywidget code loading in the output to find our widget manager
    // tslint:disable-next-line: no-any
    (window as any).vscIPyWidgets = {
        WidgetManager
    };
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

console.error('Load ipywidgets8 Script file');
export function activate() {
    console.error('Activating ipywidgets8');
    // Has to be this form for VS code to load it correctly
    console.error('call activate in ipywidgets8');
    if (!(window as any).vscIPyWidgets8) {
        (window as any).vscIPyWidgets8 = {
            load,
            unload
        };
    }
}
