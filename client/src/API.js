import { Course } from './components/models/Course';

const SERVER_URL = 'http://localhost:3001';

export const getAllCourses = async () => {
	const res = await fetch(SERVER_URL + '/api/courses');
	const courses = await res.json();
	if (res.ok) {
		return courses
			.map(
				course =>
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

export const getCourseByCode = async code => {
	if (code === '') return undefined;
	const res = await fetch(SERVER_URL + `/api/course/${code}`);
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
	} else if (res.status === 404) return undefined;
	else throw course;
};

export const getSelectedCourses = async matricola => {
	const res = await fetch(SERVER_URL + `/api/studyPlans/${matricola}`, {
		method: 'GET',
		credentials: 'include'
	});
	if (res.ok) {
		const courseJson = await res.json();
		const isFullTime = courseJson.is_full_time;
		const list = await Promise.all(
			courseJson.courses.split(',').map(code => getCourseByCode(code))
		).catch(err => {
			throw err;
		});
		return { isFullTime, list };
	} else if (res.status === 404) return { isFullTime: null, list: [] };
	else throw res;
};

export const bookASingleCourse = async code => {
	const res = await fetch(SERVER_URL + `/api/courses/book/` + code, {
		method: 'PUT',
		credentials: 'include'
	});
	if (!res.ok) throw await res.text();
};

export const unBookASingleCourse = async code => {
	const res = await fetch(SERVER_URL + `/api/courses/unBook/` + code, {
		method: 'PUT',
		credentials: 'include'
	});
	if (!res.ok) throw await res.text();
};

export const deleteStudyPlan = async matricola => {
	const originalList = await getSelectedCourses(matricola).then(list =>
		list.list.map(course => course.code)
	);
	if (originalList.length !== 0) {
		await Promise.all(
			originalList.map(code => unBookASingleCourse(code))
		).catch(err => {
			throw err;
		});
		const res = await fetch(SERVER_URL + `/api/studyPlans/${matricola}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		if (!res.ok) {
			throw await res.json();
		}
	}
};

export const updateStudyPlan = async (matricola, isFullTime, courses) => {
	const originalList = await getSelectedCourses(matricola).then(list =>
		list.list.map(course => course.code)
	);
	const newList = courses.map(course => course.code);
	await Promise.all(newList.map(code => bookASingleCourse(code))).catch(
		err => {
			throw err;
		}
	);
	if (originalList.length === 0) {
		const res = await fetch(SERVER_URL + `/api/studyPlans/${matricola}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ isFullTime: isFullTime, courses: newList })
		});
		if (!res.ok) {
			throw await res.json();
		}
	} else {
		await Promise.all(
			originalList.map(code => unBookASingleCourse(code))
		).catch(err => {
			throw err;
		});
		const res = await fetch(SERVER_URL + `/api/studyPlans/${matricola}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ isFullTime: isFullTime, courses: newList })
		});
		if (!res.ok) {
			throw await res.json();
		}
	}
};

export const logIn = async credentials => {
	const res = await fetch(SERVER_URL + '/api/sessions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(credentials)
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
		method: 'GET',
		credentials: 'include'
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
		credentials: 'include'
	});
	if (res.ok) return null;
};
