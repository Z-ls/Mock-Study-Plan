const API = require('../../API');

export const fetchAvailableCourses = async setAvailableCoursesList => {
	const list = await API.getAllCourses();
	setAvailableCoursesList(() => list);
};

export const setAvailableCoursesStatus = (
	setAvailableCoursesList,
	selectedCoursesList
) => {
	setAvailableCoursesList(availableCoursesList =>
		availableCoursesList.map(availableCourseOriginal => {
			let availableCourse = Object.create(availableCourseOriginal);
			availableCourse.isFullyBooked = false;
			availableCourse.isTaken = false;
			availableCourse.hasConflicts = false;
			availableCourse.conflictsList = [];
			availableCourse.hasPreparatory =
				!availableCourse.preparatoryCourseCode;
			if (availableCourse.currStudents === availableCourse.maxStudents)
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
						availableCourse.conflictsList.push(selectedCourseCode);
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
