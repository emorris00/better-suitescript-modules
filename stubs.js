const modules = ["currentRecord", "runtime", "search", "ui/serverWidget"];
const mocks = ["config"];

module.exports = [
	...modules.map((path) => ({
		module: `BN/${path}`,
		path: `<rootDir>/node_modules/better-suitescript-modules/src/BN/${path}.js`,
	})),
	...mocks.map((path) => ({
		module: `BN/${path}`,
		path: `<rootDir>/node_modules/better-suitescript-modules/mocks/${path}.js`,
	})),
];
