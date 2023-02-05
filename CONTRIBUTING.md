# Contributing to the IPyWidgets npm package for Jupyter Extension in Visual Studio Code

## Contributing a pull request

### Prerequisites

1. [Node.js](https://nodejs.org/) 16.14.2
2. [npm](https://www.npmjs.com/) 8.15.1
4. Windows, macOS, or Linux
5. [Visual Studio Code](https://code.visualstudio.com/)

### Setup

```shell
git clone https://github.com/Microsoft/vscode-jupyter-ipywidgets
cd vscode-jupyter-ipywidgets
npm ci
```

### Build

You can compile from the command-line. For a full compile you can use:

```shell
npx run build:dev
```

### Errors and Warnings

TypeScript errors and warnings will be displayed in the `Problems` window of Visual Studio Code.

## Branches
* `main` branch is to be used for the maintenance of the v8 package (`@vscode/jupyter-ipywidgets8`).
