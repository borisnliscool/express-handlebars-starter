import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { __dirname } from "../../config.js";

let publicKey, privateKey;
try {
    publicKey = fs.readFileSync(path.join(__dirname, "public.pem"), "utf8");
    privateKey = fs.readFileSync(path.join(__dirname, "private.pem"), "utf8");
} catch (e) {
    throw new Error("Could not read public or private key! You might need to generate a new pair. Please double check the readme file for setup information.");
}

export function getTokenContents(token) {
	try {
		const decoded = jwt.verify(token, publicKey);
		return decoded;
	} catch (error) {
		return null;
	}
}

export function createToken(data) {
	const token = jwt.sign(data, privateKey, { algorithm: "RS256" });
	return token;
}
