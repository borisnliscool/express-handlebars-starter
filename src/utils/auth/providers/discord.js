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

export function Authenticate(req, res) {
    console.log(req, res);
    return true;
}
