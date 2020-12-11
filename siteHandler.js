const fetch = require('node-fetch');
const Fuse = require('fuse.js')

const fuse_opt = {
    includeScore: true,
    keys: ['Event']
}

module.exports = {

    domus: async function (searchstring) {

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

        let pre_match_list = []
        let live_match_list = []

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
    goldbet: async function (searchstring) {

        const live_url = 'https://www.goldbet.it/getOverviewLive/?idDiscipline=0&idTab=0&isFromUser=false'
        const pre_url = 'https://www.goldbet.it/searchEvents/'

        let pre_matches = [];
        let live_match_list = [];

        const res_pre = await fetch(pre_url, {
            method: 'POST',
            headers: {
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
                'Content-Type': 'application/json',
                'Origin': 'https://www.goldbet.it',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
                'Cookie': '_ga=GA1.2.762771347.1605261895; _hjTLDTest=1; ' +
                    '_hjid=cf425899-b24e-4805-b1af-2f5f8032c6ab; ' +
                    'LPVID=A2MzI2NzUyZTcxMTBlODFh; ' +
                    'privacyCookie=true; ' +
                    'TS0189d1c3=01ffae651b11343b1abe5808c14fa7409045807d77438b0291a5615976bb0532020c45c67ebc2d1c2a82ceb4c0557af1b79009b8e3474d2fe9fd9710804872f9ccb58d6b5578140c83afcadb25e4c12ea04d8441b3; ' +
                    '_gid=GA1.2.936613910.1607519594; ' +
                    'HOSTID=3kROUTGatHgfE1eh_f3KapwLFnrN0tSeIWMFtpiL.ep1-gbweb11; ' +
                    '_hjAbsoluteSessionInProgress=0; LPSID-58824612=5PdfclEJRiGlJupH6wjRcA; ' +
                    'persist_website=^!+BMnIpypMbTbnmp6bpwrdS5mYoh+463PUPLad6Hg5wPa9TvudNehXDnx0GALBMlzeFbtaqjpwo9++VfzqDKeiabaroYjRaGfQ2gHyqbvRWjM; ' +
                    'TS01094019=01ffae651b031a2b2fcca32cff3196825f1cd8be06ad4d89daa3d9c8a079a8bb8866c47806a94dc2af8912ae70ccc2206ab68b8c37419d9c975b50338a80ffc5b1a7db6ca944000f9c8225e375cfcf3b4e114a8ef3'
            },
            body: "{strSearch: \"" + searchstring + "\"}\n"
        });


        const pre_data = await res_pre.json()

        for(let m_id = 0; m_id < 3; m_id++) {
            let match_data = {
                "Sport": pre_data[m_id].sn,
                "Country": pre_data[m_id].cd,
                "Competition": pre_data[m_id].td,
                "Event": pre_data[m_id].en,
                "Date": pre_data[m_id].ed
            }
            pre_matches.push(match_data);

        }

        //console.log(pre_data)


        const res_live = await fetch(live_url, {
            method: 'GET'
        })
        const live_data = await res_live.json()

        for(let m_id =0; m_id < live_data.leo.length; m_id++){
            let match_data = {
                "Sport": live_data.leo[m_id].snm,
                "Competition": live_data.leo[m_id].tdsc,
                "Event": live_data.leo[m_id].enm
            }
            live_match_list.push(match_data)
        }

        const fuse_live = new Fuse(live_match_list, fuse_opt)
        const result_live = fuse_live.search(searchstring)
        const live_matches = result_live.slice(0, 3)
        for (let m = 0 ; m < live_matches.length; m++){
            delete live_matches[m].refIndex
            delete live_matches[m].score
            live_matches[m] = live_matches[m].item
        }


        return {
            "name": 'Goldbet',
            "live": live_matches,
            "pre": pre_matches
        }
    }
}