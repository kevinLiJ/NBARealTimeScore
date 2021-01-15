const Crawler = require('crawler')
const Match = require('./match')

let timer = null
// 比赛列表
let matchesList = []
function getNBAInfo(callback) {
	const c = new Crawler()
	function A() {
		// 是否所有比赛都已结束
		let isAllFinish = true
		matchesList = []
		c.queue([{
			url: 'https://nba.hupu.com/games',
			callback: (error, res, done) => {
				if (!error) {
					const $ = res.$;
					// 比赛信息列表
					let matchesInfoList = []
					const matches = $(".list_box")
					// console.log(matches.length);
					if(matches.length === 0){
						callback('今日没有比赛喔 -_-')
						done()
						return
					}
					// if(matches.length)
					for (let i = 0; i < matches.length; i++) {
						const match = new Match(matches.eq(i))
						if (match.matchStatus === 'ING') {
							// 任意一场比赛没有结束，则为false
							isAllFinish = false
						}
						matchesList.push(match)
						
						matchesInfoList.push(`${match.matchTitle} ${match.score ? `(${match.score})` : ''}`)
					}
					const matchesInfoStr = matchesInfoList.join('  ')
					// 把所有比赛的比分信息拼接成字符串，传给CB，用于显示在左下角菜单栏
					callback(matchesInfoStr.length > 100 ? matchesInfoStr.slice(0,70) + '...' : matchesInfoStr)
				}
				done()
				// 如果比赛全部结束，则停止获取比赛信息
				if (!isAllFinish) {
					timer = setTimeout(() => {
						A()
					}, 3000)
				}
			}
		}])
	}
	A()
}

function getTimer() {
	return timer
}

function getMatches() {
	return matchesList
}

module.exports = { getNBAInfo, getTimer, getMatches }




