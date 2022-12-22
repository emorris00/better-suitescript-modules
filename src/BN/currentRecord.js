/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["./helpers.js", "N/currentRecord"], (helpers, NcurrentRecord) => {
	const { extend } = helpers;

	return extend(NcurrentRecord, () => ({
		get() {
			return this.convertCurrentRecord(this.__proto__.get());
		},
		convertCurrentRecord(currentRecord) {
			return extend(currentRecord, {
				getCustomFields() {
					return JSON.parse(this.getValue("custpage____fields") ?? "[]");
				},
			});
		},
	}));
});
