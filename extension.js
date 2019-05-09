// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const getNBAInfo = require('./getNBAInfo').getNBAInfo
const timer = require('./getNBAInfo').timer

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
	statusBarItem.command = 'extension.NBARealTimeScore.off'
	statusBarItem.tooltip  = '点击退出 NBARealTimeScore'
	context.subscriptions.push(vscode.commands.registerCommand('extension.NBARealTimeScore', function () {

		statusBarItem.show()
			getNBAInfo((text) => {
				statusBarItem.text = text
			})
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.NBARealTimeScore.off', function () {
		if(timer){
			clearInterval(timer)
		}
		statusBarItem.text = ''
	}));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
