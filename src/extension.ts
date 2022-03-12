// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ParsedDataProvider } from './parsedDataProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// color info
	const colorOffset = ["rgba(255, 100, 100, 0.4)", "rgba(100, 255, 100, 0.4)", "rgba(100, 100, 255, 0.4)"];

	// get config and data info
	let config = vscode.workspace.getConfiguration('fixed-length-parser');
	let headerConfig = config.get("header") as any;
	let headerKeys = Object.keys(config.get("header") as Object);
	let bodyConfig = config.get("body") as any;
	let bodyKeys = Object.keys(config.get("body") as Object);
	let tailConfig = config.get("tail") as any;
	let tailKeys = Object.keys(config.get("tail") as Object);

	let commandYN:boolean = false;
	
		// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fixed-length-parser" is now active!');
	const headerDeco: any[] = [];
	const bodyDeco: any[] = [];
	const tailDeco: any[] = [];

	const headerDecoType: {type:vscode.TextEditorDecorationType, range:{range:vscode.Range, hoverMessage: string}}[] = [];
	const bodyDecoType: {type:vscode.TextEditorDecorationType, range:{range:vscode.Range, hoverMessage: string}}[] = [];
	const tailDecoType: {type:vscode.TextEditorDecorationType, range:{range:vscode.Range, hoverMessage: string}}[] = [];


	let handleChange = function() {
		// last line;
		const lastLineNum = vscode.window.activeTextEditor?.document.lineCount;

		let offsetLine = 0;
		let offsetAt = 0;

		for (let decoType of headerDecoType) {
			decoType.type.dispose();
		}

		for (let decoType of bodyDecoType) {
			decoType.type.dispose();
		}

		for (let decoType of tailDecoType) {
			decoType.type.dispose();
		}

		headerDeco.splice(0, headerDeco.length);
		bodyDeco.splice(0, bodyDeco.length);
		tailDeco.splice(0, tailDeco.length);
		headerDecoType.splice(0, headerDecoType.length);
		bodyDecoType.splice(0, bodyDecoType.length);
		tailDecoType.splice(0, tailDecoType.length);

		// header
		for (let i = 0; i < headerKeys.length; i++){
			const curConfig = headerConfig[headerKeys[i]];
			const startPos = new vscode.Position(offsetLine, offsetAt);
			const endPos = new vscode.Position(offsetLine, offsetAt + (curConfig["size"] / 2));

			headerDeco.push({
				backgroundColor: colorOffset[(i % 3)],
				range: new vscode.Range(startPos, endPos),
				hoverMessage: headerKeys[i],
				});
			offsetAt += (curConfig["size"] / 2);
		};

		// body
		for (let i = 0; i < (lastLineNum! - 2); i++) {
			offsetLine += 1;
			offsetAt = 0;

			for (let j = 0; j < bodyKeys.length; j++) {
				const curConfig = bodyConfig[bodyKeys[j]];
				const startPos = new vscode.Position(offsetLine, offsetAt);
				const endPos = new vscode.Position(offsetLine, offsetAt + (curConfig["size"] / 2));

				bodyDeco.push({
					backgroundColor: colorOffset[(j % 3)],
					range: new vscode.Range(startPos, endPos),
					hoverMessage: bodyKeys[j],
					});

				offsetAt += (curConfig["size"] / 2);
			}
		}

		offsetLine += 1;
		offsetAt = 0;

		// tail
		for (let i = 0; i < tailKeys.length; i++){
			const curConfig = tailConfig[tailKeys[i]];
			const startPos = new vscode.Position(offsetLine, offsetAt);
			const endPos = new vscode.Position(offsetLine, offsetAt + (curConfig["size"] / 2));

			tailDeco.push({
				backgroundColor: colorOffset[(i % 3)],
				range: new vscode.Range(startPos, endPos),
				hoverMessage: tailKeys[i],
				});
			offsetAt += (curConfig["size"] / 2);
		};
			
		// attatch color
		// header
		for (let deco of headerDeco) {
			const curDecoType = vscode.window.createTextEditorDecorationType({
				backgroundColor: deco.backgroundColor,
			});
			const curRangeOption = {
				range: deco.range,
				hoverMessage: deco.hoverMessage,
			};
			headerDecoType.push({type:curDecoType, range:curRangeOption});
		}
		// body
		for (let deco of bodyDeco) {
			const curDecoType = vscode.window.createTextEditorDecorationType({
				backgroundColor: deco.backgroundColor,
			});
			const curRangeOption = {
				range: deco.range,
				hoverMessage: deco.hoverMessage,
			};
			bodyDecoType.push({type:curDecoType, range:curRangeOption});
		}
		// tail
		for (let deco of tailDeco) {
			const curDecoType = vscode.window.createTextEditorDecorationType({
				backgroundColor: deco.backgroundColor,
			});
			const curRangeOption = {
				range: deco.range,
				hoverMessage: deco.hoverMessage,
			};
			tailDecoType.push({type:curDecoType, range:curRangeOption});
		}

		console.log("handleChange");
		for (let decoType of headerDecoType) {
			vscode.window.activeTextEditor?.setDecorations(decoType.type, [decoType.range]);
		}

		for (let decoType of bodyDecoType) {
			vscode.window.activeTextEditor?.setDecorations(decoType.type, [decoType.range]);
		}

		for (let decoType of tailDecoType) {
			vscode.window.activeTextEditor?.setDecorations(decoType.type, [decoType.range]);
		}

		// make tree view
		//vscode.window.registerTreeDataProvider("fiexed-length-parser-view", new ParsedDataProvider(headerDeco, bodyDeco, tailDeco));
		vscode.window.createTreeView("fiexed-length-parser-view", {
			treeDataProvider: new ParsedDataProvider(headerDeco, bodyDeco, tailDeco)
		});
	};
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fixed-length-parser.apply', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const text = vscode.window.activeTextEditor?.document.getText().toString();
		
		config = vscode.workspace.getConfiguration('fixed-length-parser');
		headerConfig = config.get("header") as any;
		headerKeys = Object.keys(config.get("header") as Object);
		bodyConfig = config.get("body") as any;
		bodyKeys = Object.keys(config.get("body") as Object);
		tailConfig = config.get("tail") as any;
		tailKeys = Object.keys(config.get("tail") as Object);

		console.log("config", config);

		if (text){
			vscode.window.showInformationMessage("attach complete!");
		}

		handleChange();
		
		if(!commandYN) {
			vscode.workspace.onDidChangeTextDocument(handleChange);
		}
		commandYN = true;
		console.log("config: ", config);		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
