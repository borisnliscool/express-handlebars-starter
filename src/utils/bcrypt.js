import bcrypt from "bcrypt";

export async function encrypt(string) {
	const encrypted = await bcrypt.hash(string, 4);
	return encrypted;
}

export async function compare(encryptedString, originalString) {
	const isMatch = await bcrypt.compare(originalString, encryptedString);
	return isMatch;
}
