import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import config from "./config.js";

const app = express();

// Handlebars configuration
app.engine(
	".hbs",
	engine({
		extname: ".hbs",
	})
);
app.set("view engine", ".hbs");
app.set("views", path.join(config.__dirname, "src/views"));

// Public Folder
app.use(express.static(path.join(config.__dirname, "build")));

// Use all routes in src/routes
fs.readdirSync(path.join(config.__dirname, "src/routes"))
	.filter((f) => f.endsWith(".js"))
	.forEach(async (file) => {
		const route = await import(
			"file://" + path.join(config.__dirname, "src/routes", file)
		);
		app.use(route.default.router);
	});

app.listen(config.port, () => {
	console.log(`Express server listening on port ${config.port}`);
});
