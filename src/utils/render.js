import config from "../../config.js";

export default (res, page, data) => {
	res.render(page, {
		// Default data that always gets sent to handlebars
		...{
			url: config.dev == true ? `${config.url}:${config.port}` : config.url,
			siteName: config.siteName,
			title: page,
		},
		// Custom data
		...data,
	});
};
