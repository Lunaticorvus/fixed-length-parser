import * as vscode from 'vscode';

export class ParsedDataProvider implements vscode.TreeDataProvider<Object> {
    constructor(private headerData: Array<any>, private bodyData: Array<any>, private tailData: Array<any>) {}
    //constructor() {}
    getTreeItem(element: ParesdData): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ParesdData): Thenable<ParesdData[]> {
        if(element) {
            if (element.label === "Header") {
                return Promise.resolve(this.headerData.map(e => {
                    return new ParesdData(e.hoverMessage as string, vscode.window.activeTextEditor!.document.getText(e.range as vscode.Range), vscode.TreeItemCollapsibleState.None);
                }));
            } else if (element.label === "Body") {
                const lastLineRange = this.bodyData[this.bodyData.length - 1].range as vscode.Range;
                const lastLineNum = lastLineRange.start.line;
                const tmpBodyData = [];
                for (let i = 1; i < lastLineNum + 1; i++) {
                    tmpBodyData.push(new ParesdData(`Item ${i}`, `${i}`, vscode.TreeItemCollapsibleState.Collapsed));
                }
                return Promise.resolve(tmpBodyData);
            } else if (element.label === "Tail") {
                return Promise.resolve(this.tailData.map(e => {
                    return new ParesdData(e.hoverMessage as string, vscode.window.activeTextEditor!.document.getText(e.range as vscode.Range), vscode.TreeItemCollapsibleState.None);
                }));
            } else if (element.label?.toString().includes("Item")) {
                const curLineIdx = (Number(element.label.toString().split(' ')[1]));
                const tmpData = [];
                
                for (let i = 0; i < this.bodyData.length; i++) {
                    const curRange = this.bodyData[i].range as vscode.Range;
                    if (curRange.start.line === curLineIdx) {
                        tmpData.push(new ParesdData(this.bodyData[i].hoverMessage as string, vscode.window.activeTextEditor!.document.getText(this.bodyData[i].range as vscode.Range), vscode.TreeItemCollapsibleState.None));
                    }
                }
                return Promise.resolve(tmpData);
            } else {
                return Promise.resolve([]);
            }
            //return Promise.resolve(this.getChildData(this.headerData));
        } else {
            const header = new ParesdData("Header", "", vscode.TreeItemCollapsibleState.Collapsed);
            const body = new ParesdData("Body", "", vscode.TreeItemCollapsibleState.Collapsed);
            const tail = new ParesdData("Tail", "", vscode.TreeItemCollapsibleState.Collapsed);
            return Promise.resolve([header, body, tail]);
        }
    }
}

class ParesdData extends vscode.TreeItem{
    constructor(
        private key: string, 
        private value: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
        ) {
        super(key, collapsibleState);
        this.tooltip = `${key} : ${value}`;
        this.description = value;
    }
}