const API = require('../../API');

export const fetchAvailableCourses = async (
	setAvailableCoursesList,
	selectedCoursesList
) => {
	const list = await API.getAllCourses();
	setAvailableCoursesList(list);
	setAvailableCoursesStatus(setAvailableCoursesList, selectedCoursesList);
};

export const setAvailableCoursesStatus = (
	setAvailableCoursesList,
	selectedCoursesList
) => {
	if (selectedCoursesList.length === 0) {
		setAvailableCoursesList(availableCoursesList =>
			availableCoursesList.map(availableCourseOriginal => {
				let availableCourse = Object.create(availableCourseOriginal);
				if (
					availableCourse.currStudents === availableCourse.maxStudents
				)
					availableCourse.isFullyBooked = true;
				if (availableCourse.preparatoryCourseCode)
					availableCourse.hasPreparatory = false;

				return availableCourse;
			})
		);
	} else
		setAvailableCoursesList(availableCoursesList =>
			availableCoursesList.map(availableCourseOriginal => {
				let availableCourse = Object.create(availableCourseOriginal);
				availableCourse.isFullyBooked = false;
				availableCourse.isTaken = false;
				availableCourse.hasConflicts = false;
				availableCourse.conflictsList = [];
				availableCourse.hasPreparatory =
					availableCourse.preparatoryCourseCode ? false : undefined;
				if (
					availableCourse.currStudents === availableCourse.maxStudents
				)
					availableCourse.isFullyBooked = true;
				selectedCoursesList
					.map(course => course.code)
					.forEach(selectedCourseCode => {
						if (availableCourse.code === selectedCourseCode) {
							availableCourse.isTaken = true;
						}
						if (
							availableCourse.incompatibleCodes.includes(
								selectedCourseCode
							)
						) {
							availableCourse.hasConflicts = true;
							availableCourse.conflictsList.push(
								selectedCourseCode
							);
						}
						if (
							availableCourse.preparatoryCourseCode ===
							selectedCourseCode
						) {
							availableCourse.hasPreparatory = true;
						}
					});
				return availableCourse;
			})
		);
};
