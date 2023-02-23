/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["./helpers.js", "N/search"], (helpers, Nsearch) => {
	const { extend, argsToOptions } = helpers;

	return extend(Nsearch, (BNsearch) => ({
		create: argsToOptions(
			["type", , "filters", "columns", "settings", "title", "id", "isPublic", "packageId"],
			function (options) {
				return BNsearch.convertSearch(Nsearch.create(options));
			}
		),
		load: argsToOptions(["id", , "type"], function (options) {
			return BNsearch.convertSearch(Nsearch.load(options));
		}),
		convertSearch(search) {
			return extend(search, () => ({
				run() {
					return BNsearch.convertResultSet(search.run());
				},
			}));
		},
		convertResultSet(resultSet) {
			let results = [];
			let total = null;
			return extend(resultSet, () => ({
				each(callback) {
					let slice = [];
					let offset = 0;
					do {
						slice = this.getRange(offset, offset * 1000);
						for (let i = 0; i < slice.length; i++) {
							if (callback(slice[i], offset + i) === false) {
								return;
							}
						}
						offset += slice.length;
					} while (slice.length === 1000);
				},
				map(callback) {
					return this.getAll().map((...args) => callback(...args));
				},
				getAll() {
					return this.getRange(0, 99999999999999);
				},
				getRange: argsToOptions(["start", "end"], function (options) {
					const start = Math.max(0, options.start || 0);
					let end = Math.max(0, Math.min(options.end, total ?? options.end));
					if (results.length < start) {
						results.push(...new Array(start - results.length));
					}
					const getOffset = () =>
						results.length < end
							? results.length - start
							: results.slice(start, end).findIndex((a) => a === undefined);

					let offset = getOffset();
					while (offset > -1) {
						const resultSlice = resultSet
							.getRange({ start: start + offset, end: start + offset + 1000 })
							.map((row) =>
								extend(row, () => ({
									getValue(...args) {
										if (args.length === 1 && typeof args[0] === "string" && args[0].includes(".")) {
											return row.getValue({
												name: args[0].split(".")[1],
												join: args[0].split(".")[0],
											});
										}
										return row.getValue(...args);
									},
									getText(...args) {
										if (args.length === 1 && typeof args[0] === "string" && args[0].includes(".")) {
											return row.getText({
												name: args[0].split(".")[1],
												join: args[0].split(".")[0],
											});
										}
										return row.getText(...args);
									},
								}))
							);
						results.splice(start + offset, resultSlice.length, ...resultSlice);
						if (resultSlice.length !== 1000) {
							const offsetEnd = start + offset + resultSlice.length;
							total = Math.min(total ?? offsetEnd, offsetEnd);
							results = results.slice(0, total);
							end = Math.max(0, Math.min(end, total ?? end));
						}
						offset = getOffset();
					}
					return results.slice(start, end);
				}),
			}));
		},
	}));
});
