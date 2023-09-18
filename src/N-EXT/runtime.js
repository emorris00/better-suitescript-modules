/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["./helpers.js", "N/runtime", "N/search", "N/file"], (helpers, Nruntime, search, file) => {
	const { extend } = helpers;

	return extend(Nruntime, () => ({
		getCurrentScript() {
			return extend(Nruntime.getCurrentScript(), (self) => ({
				getFile() {
					const fileId = search
						.create({
							type: "script",
							columns: ["scriptfile"],
							filters: [["scriptid", "is", self.id]],
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
