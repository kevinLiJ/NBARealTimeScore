const Crawler = require('crawler')
const Match = require('./match')

let timer = null
let matchesList = []
function getNBAInfo(callback) {
	const c = new Crawler()
	function A() {
		let isAllFinish = true
		matchesList = []
		c.queue([{
			url: 'https://nba.hupu.com/games',
			callback: (error, res, done) => {
				if (!error) {
					const $ = res.$;
					let matchesInfoList = []
					const matches = $(".list_box")
					for (let i = 0; i < matches.length; i++) {
						const match = new Match(matches.eq(i))
						if (match.matchStatus !== 2) {
							isAllFinish = false
						}
						matchesList.push(match)
						matchesInfoList.push(match.matchInfo)
					}
					callback(matchesInfoList.join('  ||  '))
				}
				done()
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




