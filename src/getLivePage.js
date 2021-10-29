const vscode = require('vscode');
const Crawler = require('crawler')
const fs = require('fs')
const path = require('path')
const temptList = [
	'快来啦，老弟',
	'男宾一位，里边请',
	'手牌拿好，里边请',
	'看完再搬砖吧',
	'你搬砖的样子真帅',
	'快看球啦，老弟',
	'略略略略...',
	'还码呢，猛龙都总冠军啦',
	'还码呢，勇士总冠军啦',
	'还搬砖呢，湖人都总冠军啦',
	'湖人都总冠军',
	'看球啦老弟，别装了'
]

module.exports = class getLivePage {
	constructor(context,match) {
		this.match = match
		this.url = match.liveUrl
		this.panelId = match.liveUrl.split('/').reverse()[0]
		this.html = ''
		this.currentPanel = null
		this.timer = null
		this.isDisposed = false
		this._extensionUri = null
		this.context = context
	}

	start() {
		console.log(vscode.Uri);
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;
		if (this.currentPanel && !this.isDisposed) {
			// If we already have a panel, show it in the target column
			this.currentPanel.reveal(columnToShowIn);

		} else {
			this.isDisposed = false
			this.currentPanel = vscode.window.createWebviewPanel(
				this.panelId,
				this.match.label,
				columnToShowIn,
				{
					// Enable javascript in the webview
					enableScripts: true,

						// Only allow the webview to access resources in our extension's media directory
						// localResourceRoots: [this._extensionUri]
					// And restrict the webview to only loading content from our extension's `media` directory.
					localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'src'))]
				}
			);
			this.currentPanel.webview.html = this.generateHtml(this.getSources())

			this.currentPanel.onDidDispose(() => {
				console.log('onDidDispose');
				this.isDisposed = true
				clearTimeout(this.timer)
			})
			this.currentPanel.onDidChangeViewState(
				e => {

					const panel = e.webviewPanel;

					panel.title = panel.visible ? this.match.matchTitle : temptList[Math.floor(Math.random() * 10 - 1)] || '...'
					// panel.title = 'README.md'
		this.setPanelHtml()

				}
			);
		}
		this.setPanelHtml()
	}

	setPanelHtml() {
		const c = new Crawler()
		c.queue([{
			url: this.url,
			callback: (error, res, done) => {
				if (error) {
					return
				}

				const $ = res.$;
				const isFinish = $('.yuece_num_b a:first-child').text().indexOf('直播') < 0
				const liveHtml = $(".gamecenter_content_l .table_list_live:last-child table").html()

				// if (isFinish) {
				c.queue([{
					url: this.match.dataStatisticsUrl,
					callback: (error, res, done) => {
						if (error) {
							return
						}

						const $ = res.$;
						const dataStatisticsHtml1 = $(".gamecenter_content_l .table_list_live").eq(0).html()
						const dataStatisticsHtml2 = $(".gamecenter_content_l .table_list_live").eq(1).html()
						const teamVS = $(".team_vs").html()
						// this.currentPanel.webview.html = this.generateHtml(liveHtml, teamVS + '' + dataStatisticsHtml1 + '' + dataStatisticsHtml2)
		
						this.currentPanel.webview.postMessage({ 
							command: 'updateData',
							liveHtml,
							dataStatisticsHtml: teamVS + '' + dataStatisticsHtml1 + '' + dataStatisticsHtml2 
						});
						done()
					}
				}])
				// return
				// }

				// this.currentPanel.webview.html = this.generateHtml(liveHtml)
				this.timer = setTimeout(() => {
					console.log('setPanelHtml');
					!isFinish && this.setPanelHtml()
				}, 3000)
				done()
			}
		}])
	}

	generateHtml({animatCss,indexCss,liveHtml='', dataStatisticsHtml = '',imgLink }) {
		const templateHtml = fs.readFileSync(path.join(__dirname, './template.html'))
		let resHtml = templateHtml.toString().replace('${liveHtml}', liveHtml)
		resHtml = resHtml.replace('${dataStatisticsHtml}', dataStatisticsHtml)
		resHtml = resHtml.replace('${animatCss}', animatCss)
		resHtml = resHtml.replace('${indexCss}', indexCss)
		for (let index = 0; index < 12; index++) {
				resHtml = resHtml.replace('${img'+(index+1)+'}', imgLink['img'+(index+1)])
				resHtml = resHtml.replace('${img'+(index+1)+'}', imgLink['img'+(index+1)])		
		}
		return resHtml
	}

	getSources(){

		return {
			animatCss:this.getLink('css/animat.css'),
			indexCss:this.getLink('css/index.css'),

			imgLink:{
			img1: this.getLink('images/bulls.jpg'),
			
			img2:this.getLink('images/Warriors.jpg'),
			img3:this.getLink('images/Warriors1.jpg'),
			img4:this.getLink('images/1.jpg'),
			img5:this.getLink('images/2.jpg'),
			img6:this.getLink('images/3.jpg'),
			img7:this.getLink('images/4.jpg'),
			img8:this.getLink('images/5.jpg'),
			img9:this.getLink('images/Lakers.jpg'),
			img10:this.getLink('images/Rockets.jpg'),
			img11:this.getLink('images/Kings.jpg'),
			img12:this.getLink('images/Jazz.jpg'),
			}
		}
	}

	getLink(url){
		const onDiskPath = vscode.Uri.file(
			path.join(this.context.extensionPath, 'src', url)
		);
		
		const link = this.currentPanel.webview.asWebviewUri(onDiskPath);
		console.log(link);
		return link
	}
}

