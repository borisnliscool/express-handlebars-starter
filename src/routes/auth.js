import express from "express";
import config from "../../config.js";
import Auth, { Login } from "../utils/auth/auth.js";
import render from "../utils/render.js";
const router = express.Router();

let providers;
router.get(config.routes.login, (req, res) => {
	if (!providers) {
		providers = {};
		for (const name in config.auth.providers) {
			providers[name] = config.auth.providers[name].remoteUrl;
		}
	}

	render(res, "login", {
		providers: providers,
	});
});

router.get(config.routes.logout, Auth, (req, res) => {
    res.clearCookie("access_data");
	res.redirect(config.routes.login);
});

router.get("/auth/login/:provider", (req, res) => {
	const { provider } = req.params;
	if (!provider) return res.redirect(config.routes.home);

	Login(provider, req, res);
});

export default { router };
