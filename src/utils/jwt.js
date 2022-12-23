import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { __dirname } from "../../config.js";

const publicKey = fs.readFileSync(path.join(__dirname, "public.pem"), "utf8");
const privateKey = fs.readFileSync(path.join(__dirname, "private.pem"), "utf8");

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
