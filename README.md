# This folder is based off the the sample `web3` from https://github.com/jupyter-widgets/ipywidgets/blob/master/examples/web3

-   We have built a custom solution based on `web3` sample to host ipywidgets outside of `Jupyter Notebook`.

# Warning

-   Most of the code has been copied as is from `https://github.com/jupyter-widgets/ipywidgets/blob/master/examples/web3` & `https://github.com/jupyter-widgets/ipywidgets/blob/master/packages/html-manager/webpack.config.js`.
    -   Please try to minimize changes to original code to facilitate easier updatess.

# Solution for IPywidgets

-   IPywidgets traditionally use [requirejs](https://requirejs.org).
    -   `traditionally` as there seems to be some ongoing work to use `commonjs2`, though unsure how this will work with 3rd party widgets.
-   Using 3rd party widgets require:
    -   [requirejs](https://requirejs.org) to be available in the current browser context (i.e. `window`)
    -   Base `IPywidgets` to be defined using `define` in [requirejs](https://requirejs.org).
-   Rather than bundling using `amd` or `umd` its easier to just import everything using `commonjs2`, then export for `requirejs` using `define` by hand.
    -   `define('xyz', () => 'a')` is a simple way of declaring a named `xyz` module with the value `a` (using `requirejs`).
    -   This is generally done using tools, however we'll hand craft this as it works better and easier.
    -   `amd` is not what we want, as out `react ui` doesn't use `amd`.
    -   `umd` is does not work as we have multiple `entry points` in `webpack`.
    -   Heres' the solution `define('@jupyter-widgets/controls', () => widgets);`
-   We bundling the widget controls into our JS and exposing them for AMD using `define`
    -   We could instead include `https://unpkg.com/browse/@jupyter-widgets/html-manager@0.18.3/dist/embed-amd.js`
    -   However this is a 3.2MB file.
    -   Then our Widget manager also needs the widget controls. That would mean widget controls get included twice, once in our bundle and the other in the above mentioned `embed-amd.js` file.
    -   Solution is to include everything thats in `embed-amd.js` into our bundle.
-   We need types for `requirejs`, but installing this into `node_modules`, for extension causes conflicts as we use `require` in standard node (extension and UI).
    -   Solution is to just copy the `@types/requirejs/index.d.ts` into the `types` folder.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

### Directions for building

You might want to setup an npm link for the python repository

- git clone https://github.com/microsoft/vscode-jupyter.git
- git clone https://github.com/microsoft/vscode-jupyter-ipywidgets.git
- cd vscode-jupyter-lsp-ipywidgets
- npm link
- cd ..\vscode-jupyter
- npm link @vscode/jupyter-ipywidgets (the name of the node module in python)

Then to build vscode-jupyter-ipywidgets

- npm run download-api (updates vscode.d.ts)
- npm run webpack (which will setup stuff for using with vscode-python)

### Directions for debugging with jupyter extension

- Run the steps above for getting the npm link setup
- From with VS code, open both jupyter and lsp-middleware as two folders
- Build the 'webpack link' task for lsp-middleware
- Build the compile task for jupyter
- Set breakpoints in the dist/node/index.js file while debugging (it's a development webpack)
- Edit lsp code
- Rerun the 'webpack link' build every time (it doesn't watch as it runs a post build step)