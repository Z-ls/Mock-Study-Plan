import { Course } from './components/models/Course';

const SERVER_URL = 'http://localhost:3001';

export const getAllCourses = async () => {
	const res = await fetch(SERVER_URL + '/api/courses');
	const courses = await res.json();
	if (res.ok) {
		return courses
			.map(
				(course) =>
					new Course(
						course.code,
						course.name,
						course.credits,
						course.curr_students,
						course.max_students,
						course.incompatible_list,
						course.preparatory_course
					)
			)
			.sort((c1, c2) => {
				return c1.name > c2.name ? 1 : -1;
			});
	} else throw courses;
};

export const getCourseByCode = async (code) => {
	const res = await fetch(SERVER_URL + `/api/courses/${code}`);
	const course = await res.json();
	if (res.ok) {
		return new Course(
			course.code,
			course.name,
			course.credits,
			course.curr_students,
			course.max_students,
			course.incompatible_list,
			course.preparatory_course
		);
	} else if (res.status === 404) return null;
	else throw course;
};

export const getSelectedCourses = async (id) => {
	const res = await fetch(SERVER_URL + `/api/studyPlans/${id}`);
	const courses = await res.json();
	if (res.ok) {
		return Promise.all(
			courses.split(',').map((code) => getCourseByCode(code))
		);
	} else {
		if (res.status === 404) return [];
		else throw courses;
	}
};

export const updateStudyPlan = async (id, courses) => {
	const courseList = courses.map((course) => course.code);
	const res = await fetch(SERVER_URL + `/api/studyPlans/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(courseList),
	});

	if (!res.ok) {
		throw await res.json();
	}
};

export const logIn = async (credentials) => {
	const res = await fetch(SERVER_URL + '/api/sessions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(credentials),
	});
	const user = await res.json();
	if (res.ok) {
		return user;
	} else {
		throw user;
	}
};

export const getUserInfo = async () => {
	const res = await fetch(SERVER_URL + '/api/sessions/current', {
		credentials: 'include',
	});
	const user = await res.json();
	if (res.ok) {
		return user;
	} else {
		throw user;
	}
};

export const logOut = async () => {
	const res = await fetch(SERVER_URL + '/api/sessions/current', {
		method: 'DELETE',
		credentials: 'include',
	});
	if (res.ok) return null;
};
