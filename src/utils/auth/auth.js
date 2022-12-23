import { getTokenContents, createToken } from "../jwt.js";
import fs from "fs";
import path from "path";
import config, { __dirname } from "../../../config.js";

const providers = {};
export async function setupAuthentication () {
    fs.readdirSync(path.join(__dirname, "src/utils/auth/providers"))
        .filter((f) => f.endsWith(".js"))
        .forEach(async (file) => {
            providers[file.replace(".js", "")] = await import(
                "file://" + path.join(__dirname, "src/utils/auth/providers", file)
            );
        });
    
    console.log("🔥 Setup authentication");
};

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
	const databaseUser = await providers[provider]?.Authenticate(req);

    if (!databaseUser) {
        res.status(403).redirect(config.routes.login);
        return;
    }

	res.cookie(
		"access_data",
		createToken({
			uuid: databaseUser.uuid,
			roles: databaseUser.roles.split(","),
		})
	);
	res.status(200).redirect(config.routes.home);
}
