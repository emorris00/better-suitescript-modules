const configMock = require("suitescript-mocks/config");

class Config extends configMock.constructor {
	values = {};
	get(key) {
		return this.values[key] || null;
	}
}

module.exports = new Config();
