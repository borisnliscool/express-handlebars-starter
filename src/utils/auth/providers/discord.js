import config from "../../../../config.js";
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

export async function Authenticate(req, res) {
	const accessData = await ExchangeCode(req.query.code);
    console.log("🚀 ~ file: discord.js:49 ~ Authenticate ~ accessData", accessData)
    const userData = await GetUserData(accessData);
    console.log("🚀 ~ file: discord.js:51 ~ Authenticate ~ userData", userData)

	return true;
}
