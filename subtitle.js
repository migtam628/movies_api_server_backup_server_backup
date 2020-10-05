const fs = require("fs");
const OS = require('opensubtitles-api');
const https = require('https');
module.exports = async (req, res) => {
        let query = req.query.query;
	let tmdbid = req.query.tmdbid;
	let imdbid = req.query.imdbid;
	let s = req.query.s;
	let e = req.query.e;
	let language = req.query.lang;
	const OpenSubtitles = new OS({
		useragent: 'migtamrod',
		username: 'migtamrod',
		password: '99009900Mm.',
		ssl: true
	});

	let id = imdbid ? imdbid : tmdbid ? tmdbid : query ? query : '';
	let file_name = 'temp_sub.vtt';

	await OpenSubtitles.search({
		imdbid: imdbid,
		sublanguageid: language,
		season: s,
		episode: e,
		extensions: [ 'srt', 'vtt' ],
		limit: '1',
		tmdbid: tmdbid,
		query: query
	})
		.then((sub) => {
			const file = fs.createWriteStream(file_name);
			let sub_url = sub[Object.keys(sub)[0]][0].vtt;
			const request = https.get(sub_url, (response) => {
				response.pipe(file);
			});
			setTimeout(() => {
				fs.readFile('./' + file_name, (err, data) => {
					if (err) res.send(err);
					else {
						res.writeHead(200, { 'Content-Type': 'text/vtt' });
						res.write(data);
						res.end();
					}
				});
			}, 1000);
		})
		.catch((e) => res.send(e));
}
