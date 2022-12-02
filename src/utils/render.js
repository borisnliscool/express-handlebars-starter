import config from "../../config.js";

export default (res, page, data) => {
	res.render(page, {
		// Default data that always gets sent to handlebars
		...{
			siteName: config.siteName,
			title: page,
		},
		// Custom data
		...data,
	});
};
