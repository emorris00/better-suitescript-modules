/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["N/search", "N/runtime"], (search, runtime) => {
	return {
		get: (name) => {
			const values = search
				.create({
					type: "customrecord_config",
					columns: ["custrecord_value", "custrecord_sbx_value"],
					filters: [["name", "is", name]],
				})
				.run()
				.getRange(0, 1)[0];
			if (!values) {
				return null;
			}
			return runtime.envType === runtime.EnvType.PRODUCTION
				? values.getValue("custrecord_value")
				: values.getValue("custrecord_sbx_value");
		},
	};
});
