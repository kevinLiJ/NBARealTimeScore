module.exports = class Match {
    constructor($matchDom) {
        this.$matchDom = $matchDom

        this.team1Name = ''
        this.team2Name = ''
        this.team1Score = ''
        this.team2Score = ''
        // 1未开始 2进行中 3已结束
        this.matchStatus = -1
        this.matchTime = ''
        this.matchInfo = ''
        this.liveUrl = ''
        this.dataStatisticsUrl = ''
        this.init()
    }

    init() {
        this.team1Name = this.$matchDom.find(`.team_vs_a .team_vs_a_1 .txt span:last-child`).text().replace(/[\r\n]/g, '')
        this.team2Name = this.$matchDom.find(`.team_vs_a .team_vs_a_2 .txt span:last-child`).text().replace(/[\r\n]/g, '')
        this.matchTime = this.$matchDom.find(`.team_vs_c`).length > 0 ? this.$matchDom.find(`.team_vs_c .b p`).text().replace(/[\r\n]/g, '') : this.$matchDom.find(`.team_vs_b .b`).text().replace(/[\r\n]/g, '')

        
        this.label = `${this.team1Name} - ${this.team2Name}`
        if (this.matchTime.indexOf('未开始') > -1) {
            // 未开始，不显示比分
            this.matchInfo = `${this.label}   ${this.matchTime}`
            this.matchStatus = 1
            
        } else {
            if (this.matchTime.indexOf('已结束') > -1) {
                this.matchStatus = 3
            } else {
                this.matchStatus = 2
            }
            this.liveUrl = this.$matchDom.find('.table_choose a:last-child').attr('href')
            this.dataStatisticsUrl = this.$matchDom.find('.table_choose a:first-child').attr('href')
            // 已结束或者正在进行，获取并显示比分
            this.team2Score = this.$matchDom.find(`.team_vs_a .team_vs_a_2 .txt span:first-child`).text().replace(/[\r\n]/g, '')
            this.team1Score = this.$matchDom.find(`.team_vs_a .team_vs_a_1 .txt span:first-child`).text().replace(/[\r\n]/g, '')
            this.matchInfo = `${this.label}  ${this.team1Score} : ${this.team2Score}  ${this.matchTime}`
        }

    }
}