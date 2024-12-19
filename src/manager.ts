// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { DOMWidgetView, shims } from '@jupyter-widgets/base';
import * as jupyterlab from '@jupyter-widgets/jupyterlab-manager';
import { INotebookModel } from '@jupyterlab/notebook';
import { IRenderMime, RenderedCommon, RenderMimeRegistry, standardRendererFactories } from '@jupyterlab/rendermime';
import { Kernel } from '@jupyterlab/services';
import { Widget } from '@lumino/widgets';
import { DocumentContext } from './documentContext';
import { requireLoader } from './widgetLoader';


export const WIDGET_MIMETYPE = 'application/vnd.jupyter.widget-view+json';

// tslint:disable: no-any
// Source borrowed from https://github.com/jupyter-widgets/ipywidgets/blob/master/examples/web3/src/manager.ts

// These widgets can always be loaded from requirejs (as it is bundled).
const widgetsRegisteredInRequireJs = ['@jupyter-widgets/controls', '@jupyter-widgets/base', '@jupyter-widgets/output'];

export class WidgetManager extends jupyterlab.WidgetManager {
    private _kernel: Kernel.IKernelConnection;
    public get kernel(): Kernel.IKernelConnection {
        return this._kernel;
    }
    public el: HTMLElement;

    /**
     * Creates an instance of WidgetManager.
     * @param {Kernel.IKernelConnection} kernel
     * @param {HTMLElement} el
     * @param {{
     *             readonly widgetsRegisteredInRequireJs: Readonly<Set<string>>;
     *             errorHandler(className: string, moduleName: string, moduleVersion: string, error: any): void;
     *             loadWidgetScript(moduleName: string, moduleVersion: string): Promise<void>;
     *             successHandler(className: string, moduleName: string, moduleVersion: string): void;
     *         }} scriptLoader
     * @param {(message: string) => void} logger
     * @param {{}} [widgetState] The widget state saved in the Notebook metadata. Pass this value if required to load widget state from the Notebook.
     * @memberof WidgetManager
     */
    constructor(
        kernel: Kernel.IKernelConnection,
        el: HTMLElement,
        private readonly scriptLoader: {
            readonly widgetsRegisteredInRequireJs: Readonly<Set<string>>;
            errorHandler(className: string, moduleName: string, moduleVersion: string, error: any): void;
            loadWidgetScript(moduleName: string, moduleVersion: string): Promise<void>;
            successHandler(className: string, moduleName: string, moduleVersion: string): void;
        },
        private readonly logger: (message: string) => void,
        private readonly widgetState?: {}
    ) {
        super(
            new DocumentContext(kernel),
            new RenderMimeRegistry({
                initialFactories: standardRendererFactories,
                latexTypesetter: {
                    typeset: (_el: HTMLElement) => {
                        // Without this labels are not rendered in widgets.
                        // Either mathjax has to be setup globally or we need a type setter.
                        // Without either one of these, labels (innerText) are never rendered.
                        // See https://github.com/jupyter-widgets/ipywidgets/blob/303cae4dc268640a01ce08bf6e22da6c5cd201e4/packages/controls/src/widget_description.ts#L68 
                    }
                }
            }),
            { saveState: false }
        );
        this._kernel = kernel;
        this.el = el;
        this.rendermime.addFactory(
            {
                safe: false,
                mimeTypes: [WIDGET_MIMETYPE],
                createRenderer: (options: IRenderMime.IRendererOptions) => new jupyterlab.WidgetRenderer(options, this)
            },
            0
        );

        kernel.registerCommTarget(this.comm_target_name, async (comm, msg) => {
            const oldComm = new shims.services.Comm(comm);
            return this.handle_comm_open(oldComm, msg) as Promise<any>;
        });
    }

    /**
     * Registers a mime renderer for a given mime type.
     * We always try to render mime types by simply adding NotebookOutoutItems, 
     * However sometimes we end up with mime types (outputs) nested withing a Jupyter Output Widget.
     * In those cases we should let Jupyter Widget manager render the nested output within the output widget.
     * For that we need to register a mime renderer for the mime type.
     */
    public registerMimeRenderer(mimeType: string, render: (model: IRenderMime.IMimeModel, node: HTMLElement)=> Promise<void>): void {
        this.rendermime.addFactory(
            {
                safe: true,
                mimeTypes: [mimeType],
                createRenderer: (options: IRenderMime.IRendererOptions) => new class MimeRenderer extends RenderedCommon {
                    override async render(model: IRenderMime.IMimeModel): Promise<void> {
                        await render(model, this.node);
                    }
                }
                (options)
            }
        )
    }

    /**
     * Create a comm.
     */
    public async _create_comm(
        target_name: string,
        model_id: string,
        data?: any,
        metadata?: any
    ): Promise<shims.services.Comm> {
        const comm = this.kernel.createComm(target_name, model_id);
        if (data || metadata) {
            comm.open(data, metadata);
        }
        return Promise.resolve(new shims.services.Comm(comm));
    }

    /**
     * Get the currently-registered comms.
     */
    public _get_comm_info(): Promise<any> {
        if (this.widgetState && !this.kernel.username && !this.kernel.clientId && !this.kernel.id) {
            // Used to load widget state.
            return Promise.resolve({});
        }
        return this.kernel
            .requestCommInfo({ target_name: this.comm_target_name })
            .then((reply) => (reply.content as any).comms);
    }
    public async display_view(_msg: any, view: DOMWidgetView, options: any): Promise<Widget> {
        const element = options.node ? (options.node as HTMLElement) : this.el;
        // When do we detach?
        if (element) {
            Widget.attach(view.luminoWidget, element);
        }
        return view.luminoWidget;
    }
    public async restoreWidgets(
        notebook: INotebookModel,
        options?: {
            loadKernel: boolean;
            loadNotebook: boolean;
        }
    ): Promise<void> {
        // Hardcoded to only support loading widgets from the notebook.
        // This is called from the Jupyter extension in vscode.
        if (notebook && options?.loadNotebook && !options?.loadKernel) {
            return super.restoreWidgets(notebook, options);
        }
    }

    // @ts-ignore https://devblogs.microsoft.com/typescript/announcing-typescript-4-0-rc/#properties-overridding-accessors-and-vice-versa-is-an-error
    public get onUnhandledIOPubMessage() {
        return super.onUnhandledIOPubMessage;
    }

    protected async loadClass(className: string, moduleName: string, moduleVersion: string): Promise<any> {
        // Call the base class to try and load. If that fails, look locally
        this.logger(`WidgetManager: Loading class ${className}:${moduleName}:${moduleVersion}`);
        // tslint:disable-next-line: no-unnecessary-local-variable
        const result = await super
            .loadClass(className, moduleName, moduleVersion)
            .then((r) => {
                this.sendSuccess(className, moduleName, moduleVersion);
                return r;
            })
            .catch(async (originalException) => {
                try {
                    const loadModuleFromRequirejs =
                        widgetsRegisteredInRequireJs.includes(moduleName) ||
                        this.scriptLoader.widgetsRegisteredInRequireJs.has(moduleName);

                    if (!loadModuleFromRequirejs) {
                        // If not loading from requirejs, then check if we can.
                        // Notify the script loader that we need to load the widget module.
                        // If possible the loader will locate and register that in requirejs for things to start working.
                        await this.scriptLoader.loadWidgetScript(moduleName, moduleVersion);
                    }
                    const m = await requireLoader(moduleName);
                    if (m && m[className]) {
                        this.sendSuccess(className, moduleName, moduleVersion);
                        return m[className];
                    }
                    this.logger(`WidgetManager: failed, Loading class ${className}:${moduleName}:${moduleVersion}`);
                    throw originalException;
                } catch (ex) {
                    this.logger(`WidgetManager: failed, Loading class ${className}:${moduleName}:${moduleVersion}`);
                    this.sendError(className, moduleName, moduleVersion, originalException);
                    throw originalException;
                }
            });

        return result;
    }
    private sendSuccess(className: string, moduleName: string, moduleVersion: string) {
        try {
            this.scriptLoader.successHandler(className, moduleName, moduleVersion);
        } catch {
            // Don't let script loader failures cause a break
        }
    }

    private sendError(className: string, moduleName: string, moduleVersion: string, originalException: Error) {
        try {
            this.scriptLoader.errorHandler(className, moduleName, moduleVersion, originalException);
        } catch {
            // Don't let script loader failures cause a break
        }
    }
}
