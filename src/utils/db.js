import mysql2 from "mysql2";
import { __dirname } from "../../config.js";
import fs from "fs";
import path from "path";

let connection;
export function setupDatabase(config) {
    return new Promise((resolve, reject) => {
        connection = mysql2.createConnection(config);
        connection.connect((err, data) => {
            if (err) return console.error(err);
            console.log(`🤝 Connected to database: "${config.database}"`);
        
            const structure = fs
                .readFileSync(path.join(__dirname, "structure.sql"))
                .toString();
            const structureQueries = structure.split("\r\n\r\n");
            structureQueries.forEach(execute);
            console.log(`🤖 Ensuring database structure`);

            resolve();
        });
    })
}

async function execute(query, params) {
    return new Promise((resolve, reject) => {
		connection.query(query, params, (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});
}
export default execute;