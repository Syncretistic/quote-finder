module.exports = {

    domus: async function (searchstring) {

        const Fuse = require('fuse.js')
        const fetch = require('node-fetch');
        const fuse_opt = {
            includeScore: true,
            keys: ['Event']
        }

        let pre_url = "https://www.domusbet.it/SportsBookAPI.svc/PrematchSchedule/"
        let live_url = "https://www.domusbet.it/SportsBookAPI.svc/LiveSchedule"

        let headers_pre = {
            'Accept': '*/*',
            'Referer': 'https://www.domusbet.it/scommesse-sportive-live',
            'X-Requested-With': 'XMLHttpRequest',
            'Mg-UserRole': 'PUBLIC',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'Content-Type': 'application/json; charset=utf-8'
        };

        var pre_match_list = []
        var live_match_list = []

        const res_pre = await fetch(pre_url, {
                method: 'GET',
                headers: headers_pre
        })
        const pre_data = await res_pre.json()
        for (let cat = 0; cat < pre_data.length; cat++){
            let categoria = pre_data[cat].Name
            if (cat === 0){
                for (let ctry = 0; ctry < pre_data[cat].Children.length; ctry++){
                    let country = pre_data[cat].Children[ctry].Name
                    for (let comp = 0; comp < pre_data[cat].Children[ctry].Children.length; comp++){
                        let competizione = pre_data[cat].Children[ctry].Children[comp].Name

                        for (let evt = 0; evt < pre_data[cat].Children[ctry].Children[comp].Events.length; evt++) {
                            let event = pre_data[cat].Children[ctry].Children[comp].Events[evt].Name
                            let match_data = {
                                "Sport": categoria,
                                "Country": country,
                                "Competition": competizione,
                                "Event": event
                            }
                            pre_match_list.push(match_data)
                        }
                    }
                }
            } else if (cat === 2) {
                for(let sprt = 0; sprt < pre_data[cat].Children.length; sprt++){
                    let sport = pre_data[cat].Children[sprt].Name
                    for (let comp = 0; comp < pre_data[cat].Children[sprt].Children.length; comp++){
                        let competizione = pre_data[cat].Children[sprt].Children[comp].Name
                        for (let evt = 0; evt < pre_data[cat].Children[sprt].Children[comp].Events.length; evt++) {
                            let event = pre_data[cat].Children[sprt].Children[comp].Events[evt].Name
                            let match_data = {
                                "Sport": sport,
                                "Competition": competizione,
                                "Event": event
                            }
                            pre_match_list.push(match_data)
                        }
                    }
                }

            }

        }

        const fuse_pre = new Fuse(pre_match_list, fuse_opt)
        const result_pre = fuse_pre.search(searchstring)
        const pre_matches = result_pre.slice(0, 3)
        for (let m=0; m<pre_matches.length; m++){
            delete pre_matches[m].refIndex
            delete pre_matches[m].score
            pre_matches[m] = pre_matches[m].item
        }

        const res_live = await fetch(live_url, {
            method: 'GET',
            headers: headers_pre
        })

        const live_data = await res_live.json()

        for(let sprt = 0; sprt < live_data[0].Children.length; sprt++){
            let sport = live_data[0].Children[sprt].Name
            for (let evt = 0; evt < live_data[0].Children[sprt].Children[0].Events.length; evt++) {
                let event = live_data[0].Children[sprt].Children[0].Events[evt].Name
                let match_data = {
                    "Sport": sport.substring(6),
                    "Event": event
                }
                live_match_list.push(match_data)
            }
        }

        const fuse_live = new Fuse(live_match_list, fuse_opt)
        const result_live = fuse_live.search(searchstring)
        const live_matches = result_live.slice(0, 3)
        for (let m = 0 ; m < live_matches.length; m++){
            delete live_matches[m].refIndex
            delete live_matches[m].score
            live_matches[m] = live_matches[m].item
        }


        //const stringdata = await JSON.stringify([live_matches, pre_matches])

        return {"name": 'DomusBet',
            "live": live_matches,
            "pre": pre_matches
        }

    },
    goldbet: function (searchstring) {
        console.log('goldbet returning')
        return {
            "name": 'Goldbet',
            "live": {},
            "pre": {}
        }
    }
}