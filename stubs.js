const modules = ["currentRecord", "search", "ui/serverWidget"];
const mocks = ["config", "runtime"];

module.exports = [
	...modules.map((path) => ({
		module: `N-EXT/${path}`,
		path: `<rootDir>/node_modules/better-suitescript-modules/src/N-EXT/${path}.js`,
	})),
	...mocks.map((path) => ({
		module: `N-EXT/${path}`,
		path: `<rootDir>/node_modules/better-suitescript-modules/src/mocks/${path}.js`,
	})),
];
