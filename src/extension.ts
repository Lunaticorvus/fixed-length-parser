// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fixed-length-parser" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fixed-length-parser.apply', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const start_pos = new vscode.Position(0, 0);
		const end_pos = new vscode.Position(0, 10);
		
		const text = vscode.window.activeTextEditor?.document.getText().toString();

		// last line;
		const lastLineNum = vscode.window.activeTextEditor?.document.lineCount;

		// get config and data info
		const config = vscode.workspace.getConfiguration('fixed-length-parser');
		const headerConfig = config.get("header") as any;
		const headerKeys = Object.keys(config.get("header") as Object);
		const bodyConfig = config.get("body") as any;
		const bodyKeys = Object.keys(config.get("body") as Object);
		const tailConfig = config.get("tail") as any;
		const tailKeys = Object.keys(config.get("tail") as Object);

		console.log("config", config);

		// color info
		const colorOffset = ["rgba(255,0,0, 0.5)", "rgba(0, 255, 0, 0.5)", "rgba(0, 0, 255, 0.5)"];

		const headerDeco = [];
		const bodyDeco = [];
		const tailDeco = [];

		let offsetLine = 0;
		let offsetAt = 0;

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
		for (let deco of headerDeco) {
			const curDecoType = vscode.window.createTextEditorDecorationType({
				backgroundColor: deco.backgroundColor,
			});
			const curRangeOption = {
				range: deco.range,
				hoverMessage: deco.hoverMessage,
			};
			vscode.window.activeTextEditor?.setDecorations(curDecoType, [curRangeOption]);
		}

		for (let deco of bodyDeco) {
			const curDecoType = vscode.window.createTextEditorDecorationType({
				backgroundColor: deco.backgroundColor,
			});
			const curRangeOption = {
				range: deco.range,
				hoverMessage: deco.hoverMessage,
			};
			vscode.window.activeTextEditor?.setDecorations(curDecoType, [curRangeOption]);
		}

		for (let deco of tailDeco) {
			const curDecoType = vscode.window.createTextEditorDecorationType({
				backgroundColor: deco.backgroundColor,
			});
			const curRangeOption = {
				range: deco.range,
				hoverMessage: deco.hoverMessage,
			};
			vscode.window.activeTextEditor?.setDecorations(curDecoType, [curRangeOption]);
		}

		// for (let i = 0; i < lastLineNum!; i++) {
		// 	// header
		// 	if (i === 0) {
		// 		for (let j = 0; j < headerDeco.length; j++) {
		// 			const curDecoType = vscode.window.createTextEditorDecorationType({
		// 				backgroundColor: headerDeco[j].backgroundColor,
		// 			});
		// 			const curRangeOption = {
		// 				range: headerDeco[j].range,
		// 				hoverMessage: headerDeco[j].hoverMessage,
		// 			};
		// 			vscode.window.activeTextEditor?.setDecorations(curDecoType, [curRangeOption]);
		// 		}
		// 	}
		// 	else if (i > 0 && (i < lastLineNum! - 1)) {
		// 		// body
		// 		for (let j = 0; j < bodyDeco.length; j++) {
		// 			const curDecoType = vscode.window.createTextEditorDecorationType({
		// 				backgroundColor: bodyDeco[j].backgroundColor,
		// 			});
		// 			const curRangeOption = {
		// 				range: bodyDeco[j].range,
		// 				hoverMessage: bodyDeco[j].hoverMessage,
		// 			};
		// 			vscode.window.activeTextEditor?.setDecorations(curDecoType, [curRangeOption]);
		// 		}
		// 	}
		// 	else if (i === lastLineNum! - 1) {
		// 		//tail
		// 		for (let j = 0; j < tailDeco.length; j++) {
		// 			const curDecoType = vscode.window.createTextEditorDecorationType({
		// 				backgroundColor: tailDeco[j].backgroundColor,
		// 			});
		// 			const curRangeOption = {
		// 				range: tailDeco[j].range,
		// 				hoverMessage: tailDeco[j].hoverMessage,
		// 			};
		// 			vscode.window.activeTextEditor?.setDecorations(curDecoType, [curRangeOption]);
		// 		}
		// 	}
		// }
		//vscode.window.activeTextEditor?.setDecorations(deco_type, [range_deco]);

		if (text){
			vscode.window.showInformationMessage("attach complete!");
		}

		console.log("config: ", config);
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
