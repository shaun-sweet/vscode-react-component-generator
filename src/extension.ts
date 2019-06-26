'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands } from 'vscode';
import { createComponent } from './createComponent';


const TEMPLATE_SUFFIX_SEPERATOR = '-';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    

    const componentArray = [
        { type: "container", commandId: 'extension.genReactContainerComponentFiles' },
        { type: "stateless", commandId: 'extension.genReactStatelessComponentFiles' },
        { type: "reduxContainer", commandId: 'extension.genReactReduxContainerComponentFiles' },
        { type: "reduxStateless", commandId: 'extension.genReactReduxStatelessComponentFiles' },
    ];

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    componentArray.forEach(component => {
        const suffix = `${TEMPLATE_SUFFIX_SEPERATOR}${component.type}`;
        const disposable = commands.registerCommand(
            component.commandId, (uri) => createComponent(uri, suffix));
        
        // Add to a list of disposables which are disposed when this extension is deactivated.
        context.subscriptions.push(disposable);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    // code whe
}
