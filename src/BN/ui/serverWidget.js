/**
 * @NApiVersion 2.1
 * @author Eric Morris
 */
define(["../helpers.js", "N/ui/serverWidget"], (helpers, NserverWidget) => {
	const { extend, argsToOptions } = helpers;
	console.log(NserverWidget.createForm({}));

	return extend(NserverWidget, (BNserverWidget) => ({
		createForm: argsToOptions(["title", , "hideNavBar"], function (options) {
			return BNserverWidget.convertForm(NserverWidget.createForm(options));
		}),
		convertForm(form) {
			const newForm = extend(form, (newForm) => {
				function addFieldFactory(type, args) {
					return argsToOptions(
						args ?? [
							"id",
							"label",
							,
							"defaultValue",
							"container",
							"displayType",
							"breakType",
							"layoutType",
						],
						function (options) {
							return newForm.addField({ ...options, type });
						}
					);
				}
				return {
					addField: argsToOptions(
						[
							"id",
							"label",
							"type",
							,
							"defaultValue",
							"container",
							"displayType",
							"breakType",
							"layoutType",
						],
						function (options) {
							if (options.options && typeof options.options !== "object") {
								options.source = options.options;
								delete options.options;
							}
							const field = BNserverWidget.convertField(form.addField(options));
							options.breakType && field.updateBreakType(options);
							options.displayType && field.updateDisplayType(options);
							options.help && field.setHelpText(options);
							options.height && options.width && field.updateDisplaySize(options);
							options.layoutType && field.updateLayoutType(options);
							options.alias && (field.alias = options.alias);
							options.defaultValue && (field.defaultValue = options.defaultValue);
							options.isMandatory && (field.isMandatory = options.isMandatory);
							options.linkText && (field.linkText = options.linkText);
							options.maxLength && (field.maxLength = options.maxLength);
							options.padding && (field.padding = options.padding);
							options.richTextHeight && (field.richTextHeight = options.richTextHeight);
							options.richTextWidth && (field.richTextWidth = options.richTextWidth);
							if (options.options) {
								options.options.forEach((option) => {
									field.addSelectOption(option);
								});
							}
							fields.push(field);
							fieldsField.defaultValue = JSON.stringify(fields);
							return field;
						}
					),
					getFields: function () {
						return [...fields];
					},
					addSelectField: addFieldFactory(NserverWidget.FieldType.SELECT, [
						"id",
						"label",
						"options",
						,
						"defaultValue",
						"container",
						"displayType",
						"breakType",
						"layoutType",
					]),
					addMultiSelectField: addFieldFactory(NserverWidget.FieldType.MULTISELECT, [
						"id",
						"label",
						"options",
						,
						"defaultValue",
						"container",
						"displayType",
						"breakType",
						"layoutType",
					]),
					addUrlField: addFieldFactory(NserverWidget.FieldType.URL, [
						"id",
						"label",
						,
						"defaultValue",
						"linkText",
						"container",
						"displayType",
						"breakType",
						"layoutType",
					]),
					addDateTimeField: addFieldFactory(NserverWidget.FieldType.DATETIMETZ),
					addInlineHTMLField: addFieldFactory(NserverWidget.FieldType.INLINEHTML),
					addLongTextField: addFieldFactory(NserverWidget.FieldType.LONGTEXT),
					addRichTextField: addFieldFactory(NserverWidget.FieldType.RICHTEXT),
					addTextAreaField: addFieldFactory(NserverWidget.FieldType.TEXTAREA),
					addTimeOfDayField: addFieldFactory(NserverWidget.FieldType.TIMEOFDAY),
					...Object.fromEntries(
						[
							NserverWidget.FieldType.CHECKBOX,
							NserverWidget.FieldType.CURRENCY,
							NserverWidget.FieldType.DATE,
							NserverWidget.FieldType.EMAIL,
							NserverWidget.FieldType.FILE,
							NserverWidget.FieldType.FLOAT,
							NserverWidget.FieldType.HELP,
							NserverWidget.FieldType.INTEGER,
							NserverWidget.FieldType.IMAGE,
							NserverWidget.FieldType.LABEL,
							NserverWidget.FieldType.PASSWORD,
							NserverWidget.FieldType.PERCENT,
							NserverWidget.FieldType.PHONE,
							NserverWidget.FieldType.RADIO,
							NserverWidget.FieldType.TEXT,
						].map((type) => [`add${type[0]}${type.slice(1).toLowerCase()}Field`, addFieldFactory(type)])
					),
				};
			});
			const fields = [];
			const fieldsField = (form
				.addField({
					id: "custpage____fields",
					label: "Custom Fields",
					type: NserverWidget.FieldType.LONGTEXT,
				})
				.updateDisplayType({
					displayType: NserverWidget.FieldDisplayType.HIDDEN,
				}).defaultValue = JSON.stringify(fields));
			return newForm;
		},
		convertField(field) {
			return extend(field, () => ({
				updateBreakType: argsToOptions(["breakoutType"], field.updateBreakType),
				updateDisplayType: argsToOptions(["displayType"], field.updateDisplayType),
				setHelpText: argsToOptions(["help"], field.setHelpText),
				updateDisplaySize: argsToOptions(["height", "width"], field.updateDisplaySize),
				updateLayoutType: argsToOptions(["layoutType"], field.updateLayoutType),
			}));
		},
	}));
});
