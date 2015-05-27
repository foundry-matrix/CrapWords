module.exports = {
	db: {
		url: process.env.DBURL || require('./creds.json').database.dburl
	}
};