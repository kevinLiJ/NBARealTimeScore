const Crawler = require('crawler')

let timer = null
function getNBAInfo(callback) {
	const finishMatchInfo = {}
	const c = new Crawler()
	timer = setInterval(() => {
		c.queue([{
			url: 'https://nba.hupu.com/games', callback: (error, res, done) => {
				if (error) {
				} else {
					var $ = res.$;

					let resultArr = []
					const matches = $(".list_box")
					for (let i = 0; i < matches.length; i++) {
						if (finishMatchInfo['match' + i]) {
							// 如果这次比赛已经有缓存，就是用缓存信息
							resultArr.push(finishMatchInfo['match' + i])
							return
						}
						const match = matches.eq(i).find('.team_vs')
						const match_team1Name = match.find(`.team_vs_a .team_vs_a_1 .txt span:last-child`).text()
						const match_team2Name = match.find(`.team_vs_a .team_vs_a_2 .txt span:last-child`).text()
						const match_time = match.find(`.team_vs_c`).length > 0 ? match.find(`.team_vs_c .b p`).text() : match.find(`.team_vs_b .b`).text()
						let  matchInfo = '' 
						if(match_time.indexOf('未开始') > -1){
                            // 未开始，不显示比分
							 matchInfo = `${match_team1Name} - ${match_team2Name}   ${match_time}`.replace(/[\r\n]/g, '')
						}else{
                            // 已结束或者正在进行，获取并显示比分
                            const match_team2Score = match.find(`.team_vs_a .team_vs_a_2 .txt span:first-child`).text()
                            const match_team1Score = match.find(`.team_vs_a .team_vs_a_1 .txt span:first-child`).text()
							matchInfo = `${match_team1Name} - ${match_team2Name}  ${match_team1Score} : ${match_team2Score}  ${match_time}`.replace(/[\r\n]/g, '')
                        }
                        
						if (match_time.indexOf('已结束') > -1) {
							// 如果已经结束，就加入缓存列表中，不再每次都解析这次比赛
							finishMatchInfo['match' + i] = matchInfo
						}
						resultArr.push(matchInfo)
					}
					callback(resultArr.join('  ||  '))
					if(Object.keys(finishMatchInfo).length === matches.length ){
						 clearInterval(timer)
					}
				}
				done();
			}
		}])
	}, 3000)
}

module.exports = {getNBAInfo, timer}