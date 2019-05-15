const Crawler = require('crawler')
const Match = require('./match')

let timer = null
function getNBAInfo(callback) {
	const c = new Crawler()
	timer = setInterval(() => {
		let isAllFinish = true
		c.queue([{
			url: 'https://nba.hupu.com/games', callback: (error, res, done) => {
				if (error) {
				} else {
					const $ = res.$;

					const resultArr = []
					const matches = $(".list_box")
					for (let i = 0; i < matches.length; i++) {
						const match = new Match(matches.eq(i).find('.team_vs'))
						if(match.matchStatus !== 2){
							isAllFinish = false
						}
						resultArr.push(match.matchInfo)
					}
					
					callback(resultArr.join('  ||  '))
					if(isAllFinish){
						clearInterval(timer)
					}
				}
				done();
			}
		}])
	}, 3000)
}

module.exports = { getNBAInfo, timer }