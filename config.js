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
};

// Dont change
// __dirname because ES6
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);