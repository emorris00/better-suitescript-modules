/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["./helpers.js", "N/currentRecord"], (helpers, NcurrentRecord) => {
	const { extend } = helpers;

	return extend(NcurrentRecord, (NEXTcurrentRecord) => ({
		get() {
			return NEXTcurrentRecord.convertCurrentRecord(NEXTcurrentRecord.__proto__.get());
		},
		convertCurrentRecord(currentRecord) {
			return extend(currentRecord, () => ({
				getCustomFields() {
					return JSON.parse(NEXTcurrentRecord.getValue("custpage____fields") ?? "[]");
				},
			}));
		},
	}));
});
