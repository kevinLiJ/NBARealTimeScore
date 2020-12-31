// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const getNBAInfo = require('./src/getNBAInfo').getNBAInfo
const getTimer = require('./src/getNBAInfo').getTimer
const getMatches = require('./src/getNBAInfo').getMatches
const getLivePage = require('./src/getLivePage')

// 用于缓存所有比赛的直播页对象， 每个比赛直播页只能开一个， key值为每个比赛的label，用于与比赛对象对应
let getLivePagesInfo = {}
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
		// 如果已经暂停获取数据，则重新获取一次新数据
		// if(!getTimer()) {
		// 	getNBAInfo((text) => {
		// 		statusBarItem.text = text
		// 		showGameQuickPick()
		// 	})
		// }else {
			showGameQuickPick()
		// }
	}));

	function showGameQuickPick(){
		// 选项中只包括直播中或直播完的比赛，不包括未开始的
		let matchesList = getMatches().filter(match => match.matchStatus !== 'PENDING')
		
		// 有比赛但是直播页对象为空时，
		if (matchesList.length !== 0 && Object.keys(getLivePagesInfo).length === 0) {
			// 根据比赛列表初始化直播页
			matchesList.map(match => {
				getLivePagesInfo[match.label] = new getLivePage(match)
			})
		}
		
		vscode.window.showQuickPick([...matchesList, { label: '退出插件', code: 'exit' }]).then(selectedMatch => {
			// 如果没有选择任何一项，selectedMatch为undefined
			if (!selectedMatch) { return }

			// 选择退出时
			if (selectedMatch && selectedMatch.code === 'exit') {
				vscode.commands.executeCommand('extension.NBARealTimeScore.off');
				return
			}
			console.log(getLivePagesInfo);
			// 根据选择的比赛显示直播页
			getLivePagesInfo[selectedMatch.label].start()


		});
	}
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
