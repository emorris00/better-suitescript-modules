class Config {
	values = {};
	get(key) {
		return this.values[key] || null;
	}
}

module.exports = new Config();
