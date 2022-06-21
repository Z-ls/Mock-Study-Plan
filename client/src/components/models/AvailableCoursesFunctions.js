const API = require("../../API");

export const fetchAvailableCourses = async (
	setAvailableCoursesList,
	selectedCoursesList
) => {
	const list = await API.getAllCourses();
	setAvailableCoursesList(list);
	setAvailableCoursesStatus(setAvailableCoursesList, selectedCoursesList);
};

// In early versions, the "Marking Function" below is separated from fetching.
// However considering the situation where multiple users may operate concurrently,
// So it is decided that those two are combined, this way the bit-table will update
// Whenever big-table or study plan updates (frontend)
export const setAvailableCoursesStatus = (
	setAvailableCoursesList,
	selectedCoursesList
) => {
	// If the study plan has not been fetched yet/is empty,
	// We just mark courses with preparatory constraint and fully booked ones.
	if (selectedCoursesList.length === 0) {
		setAvailableCoursesList(availableCoursesList =>
			availableCoursesList.map(availableCourseOriginal => {
				let availableCourse = Object.create(availableCourseOriginal);
				if (availableCourse.currStudents === availableCourse.maxStudents)
					availableCourse.isFullyBooked = true;
				if (availableCourse.preparatoryCourseCode)
					availableCourse.hasPreparatory = false;
				return availableCourse;
			})
		);
		// Otherwise we perform the complete check

		// One thing I was really hesitant about was if we should add those "temporary properties" since object creation
		// But later it was decided that we preserve only the information fetched from the database
		// And go "Whatever happens in the frontend stays in the frontend, until you submit"
	} else
		setAvailableCoursesList(availableCoursesList =>
			availableCoursesList.map(availableCourseOriginal => {
				let availableCourse = Object.create(availableCourseOriginal);
				availableCourse.isFullyBooked = false;
				availableCourse.isTaken = false;
				availableCourse.hasConflicts = false;
				availableCourse.conflictsList = [];
				availableCourse.hasPreparatory = availableCourse.preparatoryCourseCode
					? false
					: undefined;
				if (availableCourse.currStudents === availableCourse.maxStudents)
					availableCourse.isFullyBooked = true;
				selectedCoursesList
					.map(course => course.code)
					.forEach(selectedCourseCode => {
						if (availableCourse.code === selectedCourseCode) {
							availableCourse.isTaken = true;
						}
						if (
							availableCourse.incompatibleCodes.includes(selectedCourseCode)
						) {
							availableCourse.hasConflicts = true;
							availableCourse.conflictsList.push(selectedCourseCode);
						}
						if (
							availableCourse.preparatoryCourseCode === selectedCourseCode
						) {
							availableCourse.hasPreparatory = true;
						}
					});
				return availableCourse;
			})
		);
};
