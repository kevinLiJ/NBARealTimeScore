// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const getNBAInfo = require('./src/getNBAInfo').getNBAInfo
const getTimer = require('./src/getNBAInfo').getTimer
const getMatches = require('./src/getNBAInfo').getMatches
const getLivePage = require('./src/getLivePage')

// 用于缓存直播页对象， 每个比赛直播页只能开一个
let getLivePageList = {}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
	statusBarItem.command = 'extension.NBARealTimeScore.showMenu'
	statusBarItem.tooltip = '点击显示列表'
	context.subscriptions.push(vscode.commands.registerCommand('extension.NBARealTimeScore', function () {
		statusBarItem.show()
		getNBAInfo((text) => {
			statusBarItem.text = text
		})
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.NBARealTimeScore.off', function () {
		clearInterval(getTimer())
		this.getLivePage = {}
		statusBarItem.text = ''
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.NBARealTimeScore.showMenu', function () {
		let matchesList = getMatches()
		// 有比赛但是直播页对象为空时，根据比赛列表初始化直播页
		if (matchesList.length !== 0 && Object.keys(getLivePageList).length === 0) {
			matchesList.map(match => {
				getLivePageList[match.label] = new getLivePage(match)
			})
		}
		vscode.window.showQuickPick([...matchesList,{label: '退出插件', code:'exit'}]).then(selectedMatch => {
			// 根据选项打开直播页 或者退出
			if(selectedMatch.code === 'exit'){
				vscode.commands.executeCommand('extension.NBARealTimeScore.off');
				return
			}
			getLivePageList[selectedMatch.label].start()


		});
	}));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
