import { getTokenContents } from "../jwt.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../../../config.js";

const providers = {};

(async () => {
	fs.readdirSync(path.join(__dirname, "src/utils/auth/providers"))
		.filter((f) => f.endsWith(".js"))
		.forEach(async (file) => {
			providers[file.replace(".js", "")] = await import(
				"file://" + path.join(__dirname, "src/utils/auth/providers", file)
			);
		});
})();

export default function Auth(req, res, next) {
	const { access_data } = req.cookies;
	if (!access_data) return res.status(403).redirect("/login");

	const contents = getTokenContents(access_data);
	if (!contents) {
		res.clearCookie("access_data");
		return res.status(403).redirect("/login");
	}

	req.user = contents;

	next();
}

export async function Login(provider, req, res) {
	const success = await providers[provider].Authenticate(req, res);

	if (success) res.send("logged in");
	else res.send("error");
}
