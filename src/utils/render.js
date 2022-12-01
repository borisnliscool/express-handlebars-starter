import config from "../../config.js";

export default (res, page, data) => {
	res.render(page, {
		// Default data that always gets sent to handlebars
		...{
			url: config.url,
			title: page,
		},
		// Custom data
		...data,
	});
};
