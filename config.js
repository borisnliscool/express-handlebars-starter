import { fileURLToPath } from "url";
import path from "path";

// __dirname because ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	url: "localhost",
	port: 3000,
	__dirname,
};