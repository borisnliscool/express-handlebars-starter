import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import config, { __dirname } from "./config.js";
import cookieParser from "cookie-parser";
import { setupDatabase } from "./src/utils/db.js";
import { setupAuthentication } from "./src/utils/auth/auth.js";
import responseTime from "response-time";

await setupDatabase(config.database);
await setupAuthentication();

const app = express();

// Use json to be able to parse POST requests bodies
app.use(express.json());
app.use(cookieParser());
app.use(responseTime());

// Handlebars configuration
app.engine(
	".hbs",
	engine({
		extname: ".hbs",
	})
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "src/views"));

// Public Folder
app.use(express.static(path.join(__dirname, "dist")));

// Use all routes in src/routes
fs.readdirSync(path.join(__dirname, "src/routes"))
	.filter((f) => f.endsWith(".js"))
	.forEach(async (file) => {
		const route = await import(
			"file://" + path.join(__dirname, "src/routes", file)
		);
		app.use(route.default.router);
	});

app.listen(config.port, () => {
	console.log(`🚀 Server running on http://localhost:${config.port}`);
});
