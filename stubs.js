const modules = ["currentRecord", "search", "ui/serverWidget"];
const mocks = ["config", "runtime"];

module.exports = [
	...modules.map((path) => ({
		module: `BN/${path}`,
		path: `<rootDir>/node_modules/better-suitescript-modules/src/BN/${path}.js`,
	})),
	...mocks.map((path) => ({
		module: `BN/${path}`,
		path: `<rootDir>/node_modules/better-suitescript-modules/src/mocks/${path}.js`,
	})),
];
