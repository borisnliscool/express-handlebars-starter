import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import fs from "fs";
import config, { __dirname } from "./config.js";
import cookieParser from "cookie-parser";
import { setupDatabase } from "./src/utils/db.js";
import { setupAuthentication } from "./src/utils/auth/auth.js";
import responseTime from "response-time";
import helmet from "helmet";
import morgan from "morgan";

await setupDatabase(config.database);
await setupAuthentication();

const app = express();

// Use json to be able to parse POST requests bodies
app.use(express.json());
app.use(cookieParser());
app.use(responseTime());
app.use(helmet());
app.use(morgan("dev"));

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
const routeFiles = fs
	.readdirSync(path.join(__dirname, "src/routes"))
	.filter((f) => f.endsWith(".js"));

routeFiles.forEach(async (file) => {
	const routeModule = await import(
		"file://" + path.join(__dirname, "src/routes", file)
	);
	const route = routeModule.default;
	app.use(route.router);
});

app.listen(config.port, () => {
	console.log(`🚀 Server running on http://localhost:${config.port}`);
});
