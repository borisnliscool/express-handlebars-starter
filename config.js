import * as dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from "url";
import path from "path";

// Configuration
export default {
	// set to false for production
	dev: true,
	// port for the express server
	port: 3000,
	// the name for your website, used for the document title
	siteName: "example.com",

    siteUrl: "http://localhost:3000",

    routes: {
        index: "/",
        home: "/home",
        login: "/login",
        logout: "/logout",
    },

    database: {
        host: process.env.DB_HOST ?? "localhost",
        user: process.env.DB_USER ?? "root",
        password: process.env.DB_PASSWORD ?? "",
        database: process.env.DB_DATABASE ?? "example_database",
    },

    auth: {
        providers: {
            discord: {
                clientId: process.env.AUTH_DISCORD_CLIENT_ID,
                permissions: ["identify", "guilds", "guilds.members.read"],
                secret: process.env.AUTH_DISCORD_SECRET
            }
        }
    }
};

// Dont change
// __dirname because ES6
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);