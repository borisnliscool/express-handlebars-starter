import { getTokenContents, createToken } from "../jwt.js";
import fs from "fs";
import path from "path";
import config, { __dirname } from "../../../config.js";
import execute from "../db.js";

const providers = {};
export async function setupAuthentication() {
	fs.readdirSync(path.join(__dirname, "src/utils/auth/providers"))
		.filter((f) => f.endsWith(".js"))
		.forEach(async (file) => {
			providers[file.replace(".js", "")] = await import(
				"file://" + path.join(__dirname, "src/utils/auth/providers", file)
			);
		});

	console.log("🔥 Setup authentication");
}

export default async function Auth(req, res, next) {
	const { access_data } = req.cookies;
	if (!access_data) return res.status(403).redirect("/login");

	const contents = getTokenContents(access_data);
	if (!contents) {
		res.clearCookie("access_data");
		return res.status(403).redirect("/login");
	}

	const userData = (
		await execute("SELECT * FROM user WHERE uuid = ?", [contents.uuid])
	)[0];
	if (!userData) {
		res.clearCookie("access_data");
		return res.status(403).redirect("/login");
	}

	req.user = {
        id: userData.user_id,
        uuid: userData.uuid,
        roles: userData.roles.split(","),
        created_at: userData.created_at
    };

	next();
}

export async function Login(provider, req, res) {
	const databaseUser = await providers[provider]?.Authenticate(req);

	if (!databaseUser) {
		res.status(403).redirect(config.routes.login);
		return;
	}

	res.cookie(
		"access_data",
		createToken({
			uuid: databaseUser.uuid,
		})
	);
	res.status(200).redirect(config.routes.home);
}
