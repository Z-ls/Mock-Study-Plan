'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const coursesDAO = require('./availableCoursesDAO');
const studyPlanDAO = require('./selectedCoursesDAO');
const userDAO = require('./userDAO');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());
// CORS Options
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};

app.use(cors(corsOptions));

passport.use(
	new LocalStrategy(async function verify(username, password, cb) {
		const user = await userDAO.getUserByIdAndPassword(username, password);
		if (!user)
			return cb(null, false, {
				error: 'Incorrect username or password.'
			});
		return cb(null, user);
	})
);

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (user, cb) {
	return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ error: 'User not authorized' });
};

app.use(
	session({
		secret: 'WhatIfITellYouIDoNotKnowWhatIAmDoing',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.authenticate('session'));

const validateRequest = async (req, res, next) => {
	const code = req.params.code;
	const matricola = req.params.matricola;
	const studyPlan = req.body.courses;
	const isFullTime = req.body.isFullTime;
	// Check the formats
	if ((code && code.length != 7) || (matricola && matricola.length != 7))
		return res.status(422).send({ error: 'Code/Matricola abnormal' });
	if (
		studyPlan &&
		(await Promise.all(
			studyPlan.map(code => coursesDAO.getCourseByCode(code))
		).then(rets => rets.some(ret => !ret)))
	)
		return res
			.status(422)
			.send({ error: 'Study Plan contains abnormal chunks' });

	// Check the constraints
	if (studyPlan && studyPlan.length > 0 && isFullTime) {
		let currCredits = 0;
		const studyPlanCourseList = await Promise.all(
			studyPlan.map(code => coursesDAO.getCourseByCode(code))
		);
		studyPlanCourseList.forEach(course => {
			if (course.curr_Students === course.max_students) {
				return res
					.status(422)
					.send({ error: 'List contains fully booked course' });
			}
			if (
				course.incompatible_list &&
				studyPlan.some(code =>
					course.incompatible_list.split(' ').includes(code)
				)
			)
				return res
					.status(422)
					.send({ error: 'List contains conflict pairs' });
			if (
				course.preparatory_course &&
				!studyPlan.includes(course.preparatory_course)
			)
				return res.status(422).send({
					error: 'List contains course that lacks preparatory course'
				});
			currCredits += course.credits;
		});
		if (
			currCredits > (isFullTime ? 80 : 40) ||
			currCredits < (isFullTime ? 60 : 20)
		)
			return res.status(422).send({
				error: 'List does not meet credit constraints'
			});
	}
	return next();
};

/* Session APIs */

// POST /api/sessions
app.post('/api/sessions', function (req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return res.status(401).send(info);
		}
		req.login(user, err => {
			if (err) return next(err);
			return res.status(201).json(req.user);
		});
	})(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user);
	} else res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
	req.logout(() => {
		res.end();
	});
});
// Functional APIs

app.get('/api/courses', async (req, res) => {
	return await coursesDAO.getAllCourses().then(
		courses => {
			return courses
				? res.status(200).json(courses)
				: res.status(404).end();
		},
		err => {
			return res.status(500).send(err);
		}
	);
});

app.get('/api/course/:code', async (req, res) => {
	return await coursesDAO.getCourseByCode(req.params.code).then(
		course => {
			return course
				? res.status(200).json(course)
				: res.status(404).send('Course not found');
		},
		err => {
			return res.status(500).send(err);
		}
	);
});

app.get(
	'/api/studyPlans/:matricola',
	isLoggedIn,
	validateRequest,
	async (req, res) => {
		return await studyPlanDAO.getStudyPlanById(req.params.matricola).then(
			studyPlan => {
				return studyPlan
					? res.status(200).json(studyPlan)
					: res.status(404).end();
			},
			err => {
				return res.status(500).send(err);
			}
		);
	}
);

app.post(
	'/api/studyPlans/:matricola',
	isLoggedIn,
	validateRequest,
	async (req, res) => {
		return await studyPlanDAO
			.addStudyPlan(
				req.params.matricola,
				req.body.isFullTime,
				req.body.courses
			)
			.then(
				() => {
					return res.status(201).end();
				},
				err => {
					return res.status(503).json(err);
				}
			);
	}
);

app.put(
	'/api/studyPlans/:matricola',
	isLoggedIn,
	validateRequest,
	async (req, res) => {
		return await studyPlanDAO
			.updateStudyPlan(
				req.params.matricola,
				req.body.isFullTime,
				req.body.courses
			)
			.then(
				() => {
					return res.status(201).end();
				},
				err => {
					return res.status(503).json(err);
				}
			);
	}
);

app.delete(
	'/api/studyPlans/:matricola',
	isLoggedIn,
	validateRequest,
	async (req, res) => {
		return await studyPlanDAO.deleteStudyPlan(req.params.matricola).then(
			studyPlan => {
				return res.status(204).json(studyPlan);
			},
			err => {
				return res.status(500).send(err);
			}
		);
	}
);

app.put(
	'/api/courses/book/:code',
	isLoggedIn,
	validateRequest,
	async (req, res) => {
		return await coursesDAO.bookACourseByCode(req.params.code).then(
			ret => {
				return ret ? res.status(200).end() : res.status(404).end();
			},
			err => {
				return res.status(503).send(err);
			}
		);
	}
);

app.put(
	'/api/courses/unBook/:code',
	isLoggedIn,
	validateRequest,
	async (req, res) => {
		if (req.params.code.length !== 7) return res.status(422).end();
		return await coursesDAO.unBookACourseByCode(req.params.code).then(
			ret => {
				return ret ? res.status(200).end() : res.status(404).end();
			},
			err => {
				return res.status(503).send(err);
			}
		);
	}
);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
