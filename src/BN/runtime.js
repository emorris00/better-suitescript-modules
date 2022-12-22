/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["./helpers.js", "N/runtime", "N/search", "N/file"], (helpers, Nruntime, search, file) => {
	let currentScript;
	return helpers.extend(Nruntime, () => ({
		getCurrentScript() {
			if (!currentScript) {
				currentScript = Nruntime.getCurrentScript();
				const fileId = search
					.create({
						type: "script",
						columns: ["scriptfile"],
						filters: [["scriptid", "is", currentScript.id]],
					})
					.run()
					.getRange(0, 1)[0]
					.getValue("scriptfile");

				currentScript = helpers.extend(currentScript, {
					file: file.load(fileId),
				});
			}
			return currentScript;
		},
	}));
});
