/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["./helpers.js", "N/runtime", "N/search", "N/file"], (helpers, Nruntime, search, file) => {
	return helpers.extend(Nruntime, () => ({
		getCurrentScript() {
			return helpers.extend(Nruntime.getCurrentScript(), (currentScript) => ({
				getFile() {
					const fileId = search
						.create({
							type: "script",
							columns: ["scriptfile"],
							filters: [["scriptid", "is", currentScript.id]],
						})
						.run()
						.getRange(0, 1)[0]
						.getValue("scriptfile");

					return file.load(fileId);
				},
			}));
		},
	}));
});
