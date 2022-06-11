'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');
const db = new sqlite.Database('courses.db', (err) => {
	if (err) throw err;
});

exports.getUserByIdAndPassword = (id, password) => {
	return new Promise((resolve, reject) => {
		const query = 'SELECT * FROM Users WHERE matricola = ?';
		db.get(query, [id], (err, row) => {
			if (err) {
				reject(err);
			}
			if (!row) {
				resolve(false);
			} else {
				const user = {
					matricola: row.matricola,
					first_name: row.first_name,
					last_name: row.last_name,
				};
				crypto.scrypt(
					password,
					row.salt,
					32,
					function (err, hashedPassword) {
						if (err) reject(err);
						if (
							!crypto.timingSafeEqual(
								Buffer.from(row.hex, 'hex'),
								hashedPassword
							)
						)
							resolve(false);
						else resolve(user);
					}
				);
			}
		});
	});
};
