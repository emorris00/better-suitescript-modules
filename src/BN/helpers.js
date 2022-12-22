/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define([], () => {
	function extend(obj, func) {
		console.log(obj);
		console.trace();
		const newObj = Object.create(obj);
		const fields = func(newObj, obj);
		Object.entries(fields).forEach(([prop, value]) => {
			Object.defineProperty(newObj, prop, { value });
		});
		return Object.freeze(newObj);
	}

	function argsToOptions(args, func) {
		const required = args.slice(
			0,
			args.findIndex((a) => a === undefined)
		);
		const keys = args.filter(Boolean);
		return function (...args) {
			let options;
			if (args.length === 1 && typeof args[0] === "object") {
				options = args[0];
			} else {
				options = Object.fromEntries(keys.map((key, i) => [key, args[i]]));
			}
			required.forEach((key) => {
				if (!(key in options)) {
					throw new Error(`Missing required option '${key}'`);
				}
			});
			return func(options);
		};
	}

	return {
		extend,
		argsToOptions,
	};
});
