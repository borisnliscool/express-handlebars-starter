import config from "../../../../config.js";
import execute from "../../db.js";
import { CronJob } from "cron";
const discordConfig = config.auth.providers.discord;

// Setup remote url
const searchParams = new URLSearchParams({
	client_id: discordConfig.clientId,
	redirect_uri: `${config.siteUrl}/auth/login/discord`,
	response_type: "code",
	scope: discordConfig.permissions.join(" "),
}).toString();

discordConfig.remoteUrl = new URL(
	`https://discord.com/api/oauth2/authorize?${searchParams}`
);

async function RefreshAllTokens() {
	const expires = new Date().getTime() + 24 * 60 * 60 * 1000;
	const tokens = await execute(
		"SELECT * FROM auth_discord WHERE expires <= ?",
		[expires]
	);

	console.log("🚀 ~ file: discord.js:21 ~ RefreshAllTokens ~ tokens", tokens);
}

const job = new CronJob("*/15 * * * *", RefreshAllTokens);
job.start();

async function ExchangeCode(code) {
	let params = new URLSearchParams();
	params.append("client_id", discordConfig.clientId);
	params.append("client_secret", discordConfig.secret);
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("redirect_uri", `${config.siteUrl}/auth/login/discord`);

	const res = await fetch("https://discord.com/api/v10/oauth2/token", {
		method: "POST",
		body: params,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json",
		},
	});

	const response = await res.json();
	return response;
}

async function GetUserData(accessData) {
	const res = await fetch("https://discord.com/api/v10/users/@me", {
		method: "GET",
		headers: { authorization: `Bearer ${accessData.access_token}` },
	});

	const response = await res.json();
	return response;
}

export async function Authenticate(req) {
	const accessData = await ExchangeCode(req.query.code);
	if (!accessData) return false;

	const userData = await GetUserData(accessData);
	if (!userData) return false;

	const user = (
		await execute(
			`
        SELECT u.*
        FROM user u
        INNER JOIN auth_discord a ON u.user_id = a.user_id
        WHERE a.discord_id = ?;
        `,
			[userData.id]
		)
	)[0];
	if (!user) return false;

	const expiryDate = new Date(Date.now() + accessData.expires_in * 1000);

	await execute(
		`
        UPDATE auth_discord
        SET access_token = ?, refresh_token = ?, expires = ?
        WHERE discord_id = ?;
        `,
		[
			accessData.access_token,
			accessData.refresh_token,
			expiryDate.getTime(),
			userData.id,
		]
	);

	return user;
}
