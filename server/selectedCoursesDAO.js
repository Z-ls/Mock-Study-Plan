'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('courses.db', (err) => {
	if (err) throw err;
});

exports.getStudyPlanById = (id) => {
	return new Promise((resolve, reject) => {
		const query = 'SELECT courses FROM Study_Plans WHERE matricola = ?';
		db.get(query, [id], (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
};

exports.updateStudyPlan = (id, courses) => {
	return new Promise((resolve, reject) => {
		const query = 'UPDATE Study_Plans SET courses = ? WHERE matricola = ?';
		db.run(query, [courses, id], (err) => {
			if (err) reject(err);
			else resolve(true);
		});
	});
};
