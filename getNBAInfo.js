const Crawler = require('crawler')
const Match = require('./match')

let timer = null
function getNBAInfo(callback) {
	const c = new Crawler()
	function A() {
		let isAllFinish = true
		c.queue([{
			url: 'https://nba.hupu.com/games', callback: (error, res, done) => {
				if (!error) {
					const $ = res.$;

					const resultArr = []
					const matches = $(".list_box")
					for (let i = 0; i < matches.length; i++) {
						const match = new Match(matches.eq(i).find('.team_vs'))
						if (match.matchStatus !== 2) {
							isAllFinish = false
						}
						resultArr.push(match.matchInfo)
					}
					callback(resultArr.join('  ||  '))
				}
				done()
				if (!isAllFinish) {
					timer = setTimeout(() => {
						console.log(1)
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

module.exports = { getNBAInfo, getTimer }




