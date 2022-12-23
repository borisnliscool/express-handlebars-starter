import express from "express";
import config from "../../config.js";
import Auth from "../utils/auth/auth.js";
import render from "../utils/render.js";
const router = express.Router();

router.get(config.routes.index, (req, res) => {
	render(res, "index", {
		title: "Home",
	});
});

router.get(config.routes.home, Auth, (req, res) => {
	res.send(req.user);
});

export default { router };
