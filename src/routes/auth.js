import express from "express";
import config from "../../config.js";
import { Login } from "../utils/auth/auth.js";
import render from "../utils/render.js";
const router = express.Router();

router.get(config.routes.login, (req, res) => {
    if (req.user) res.redirect(config.routes.home);

    const providers = {};
    for (const name in config.auth.providers) { 
        providers[name] = config.auth.providers[name].remoteUrl;
    }

    render(res, "login", {
        providers: providers
    });
});

router.get("/auth/login/:provider", (req, res) => {
    const { provider } = req.params;
    if (!provider) return res.redirect(config.routes.home);

    Login(provider, req, res);
})

// router.get("/logintest", (req, res) => {
// 	res.cookie(
// 		"access_data",
// 		createToken({
// 			uuid: "1e8e67e9-829e-11ed-a4f9-38f3ab6840a5",
// 			roles: ["user"],
// 		})
// 	);
// 	res.send("ok");
// });

export default { router };