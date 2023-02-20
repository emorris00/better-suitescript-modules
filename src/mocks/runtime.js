const runtimeMock = require("suitescript-mocks/runtime");

class Runtime extends runtimeMock.constructor {
	getCurrentScript = () => {
		const currentScript = runtimeMock.getCurrentScript();
		// TODO: replace with actual file mock or something
		currentScript.getFile = function () {
			return {
				id: 1,
				path: "/file",
			};
		};
		return currentScript;
	};
}

module.exports = new Runtime();
