const API = require('../../API');

export const fetchAvailableCourses = async (setAvailableCoursesList) => {
	const list = await API.getAllCourses();
	setAvailableCoursesList(() => list);
};

export const setAvailableCoursesStatus = (
	availableCoursesList,
	setAvailableCoursesList,
	selectedCoursesList
) => {
	setAvailableCoursesList(() =>
		availableCoursesList.map((availableCourse) => {
			availableCourse.isFullyBooked = false;
			availableCourse.isTaken = false;
			availableCourse.hasConflicts = false;
			availableCourse.conflictsList = [];
			availableCourse.hasPreparatory =
				!availableCourse.preparatoryCourseCode;
			if (availableCourse.currStudents === availableCourse.maxStudents)
				availableCourse.isFullyBooked = true;
			selectedCoursesList.forEach((selectedCourse) => {
				if (selectedCourse.code === availableCourse.code) {
					availableCourse.isTaken = true;
				}
				if (
					selectedCourse.incompatibleCodes.includes(
						availableCourse.code
					)
				) {
					availableCourse.hasConflicts = true;
					availableCourse.conflictsList.push(selectedCourse.code);
				}
				if (
					selectedCourse.code ===
					availableCourse.preparatoryCourseCode
				) {
					availableCourse.hasPreparatory = true;
				}
			});
			return availableCourse;
		})
	);
};
