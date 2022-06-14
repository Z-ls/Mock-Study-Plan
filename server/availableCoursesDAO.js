'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('courses.db', err => {
	if (err) throw err;
});

exports.getAllCourses = () => {
	return new Promise((resolve, reject) => {
		const query = 'SELECT * FROM Courses';
		db.all(query, [], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};

exports.getCourseByCode = code => {
	return new Promise((resolve, reject) => {
		const query = 'SELECT * FROM Courses WHERE code = ?';
		db.get(query, [code], (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
};

exports.bookACourseByCode = code => {
	return new Promise((resolve, reject) => {
		const query =
			'UPDATE Courses SET curr_students = curr_students + 1 WHERE code = ?';
		db.run(query, [code], function (err) {
			if (err) reject(err);
			else resolve(this.changes ? true : false);
		});
	});
};

exports.unBookACourseByCode = code => {
	return new Promise((resolve, reject) => {
		const query =
			'UPDATE Courses SET curr_students = curr_students - 1 WHERE code = ?';
		db.run(query, [code], function (err) {
			if (err) reject(err);
			else resolve(this.changes ? true : false);
		});
	});
};
