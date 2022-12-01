import express from "express";
import render from "../utils/render.js";
const router = express.Router();

router.get("/", (req, res) => {
	render(res, "index");
});

export default { router };
