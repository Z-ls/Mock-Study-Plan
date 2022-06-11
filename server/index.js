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
	credentials: true,
};

app.use(cors(corsOptions));

passport.use(
	new LocalStrategy(async function verify(username, password, cb) {
		const user = await userDAO.getUserByIdAndPassword(username, password);
		if (!user) return cb(null, false, 'Incorrect username or password.');
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
		saveUninitialized: false,
	})
);

app.use(passport.authenticate('session'));

/* Session APIs */

// POST /api/sessions
app.post('/api/sessions', function (req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return res.status(401).send(info);
		}
		req.login(user, (err) => {
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
		(courses) => {
			return res.status(200).json(courses);
		},
		(err) => {
			return res.status(500).send(err);
		}
	);
});

app.get('/api/courses/:code', async (req, res) => {
	return await coursesDAO.getCourseByCode(req.params.code).then(
		(course) => {
			return course
				? res.status(200).json(course)
				: res.status(404).send('Course not found');
		},
		(err) => {
			return res.status(500).send(err);
		}
	);
});

app.get('/api/studyPlans/:id', async (req, res) => {
	return await studyPlanDAO.getStudyPlanById(req.params.id).then(
		(course) => {
			return course
				? res.status(200).json(course.courses)
				: res.status(404).send('Study Plan not found');
		},
		(err) => {
			return res.status(500).send(err);
		}
	);
});

app.put('/api/studyPlans/:id', async (req, res) => {
	return await studyPlanDAO.updateStudyPlan(req.params.id, req.body).then(
		() => {
			return res.status(201).end();
		},
		(err) => {
			return res.status(503).json(err);
		}
	);
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
