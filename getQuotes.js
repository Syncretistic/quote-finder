module.exports = {
    getAllOdds: function(search_string, res){
        var siteHandler = require('./siteHandler')
        console.log('starting')
        Promise.all([
            siteHandler.domus(search_string),
            siteHandler.goldbet(search_string),
        ]).then(function (results) {
            console.log('there are ' + results.length + ' results')
            return Promise.all(results.map(function (response) {
                console.log('RESPONSE IS'+ JSON.stringify(response))
                return (response);
            }));
        }).then(function(results){
            res.render('results', { title: 'Tokkn', search_string: search_string, results: results})
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }
}



