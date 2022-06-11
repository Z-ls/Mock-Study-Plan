import { getSelectedCourses, updateStudyPlan } from '../../API';

export const fetchSelectedCourses = async (
	setSelectedCoursesList,
	matricola
) => {
	const list = await getSelectedCourses(matricola);
	setSelectedCoursesList(() => list);
};

export const updateSelectedCourses = async (matricola, selectedCoursesList) => {
	await updateStudyPlan(matricola, selectedCoursesList);
};

export const deleteCurrentStudyPlan = (
	setSelectedCoursesList,
	setCurrCredits,
	setIsValid
) => {
	setSelectedCoursesList([]);
	setCurrCredits(0);
	setIsValid(true);
};

export const addSelectedCourse = (
	course,
	selectedCoursesList,
	setSelectedCoursesList
) => {
	// if (
	// 	checkDuplicate(course.code, selectedCoursesList) &&
	// 	(course.preparatoryCourseCode
	// 		? checkPreparatory(
	// 				course.preparatoryCourseCode,
	// 				setSelectedCoursesList
	// 		  )
	// 		: true) &&
	// 	checkConflicts(course.code, selectedCoursesList) &&
	// 	checkFullyBooked(selectedCoursesList)
	// )
	if (
		!(
			course.isFullyBooked ||
			course.isTaken ||
			course.hasConflicts ||
			!course.hasPreparatory
		)
	)
		setSelectedCoursesList((originalList) => originalList.concat(course));
};

export const removeSelectedCourse = async (
	courseCode,
	selectedCoursesList,
	setSelectedCoursesList
) => {
	const newList = selectedCoursesList.filter(
		(course) => course.code !== courseCode
	);
	setSelectedCoursesList((selectedCoursesList) =>
		selectedCoursesList.filter((course) => course.code !== courseCode)
	);
};

export const checkFullyBooked = (selectedCoursesList) => {
	return !selectedCoursesList.some(
		(course) => course.currStudents === course.maxStudents
	);
};

export const checkDuplicate = (courseCode, selectedCoursesList) => {
	return !selectedCoursesList
		.map((course) => course.code)
		.includes(courseCode);
};

export const checkConflicts = (courseCode, selectedCoursesList) => {
	let flag = true;
	selectedCoursesList.forEach((course) => {
		if (course.incompatibleCodes.includes(courseCode)) {
			flag = false;
		}
	});
	return flag;
};

export const checkPreparatory = (courseCode, selectedCoursesList) => {
	return !selectedCoursesList
		.map((course) => course.preparatoryCourseCode)
		.includes(courseCode);
};

export const checkCredits = (
	selectedCoursesList,
	setCurrCredits,
	maxCredits,
	minCredits
) => {
	let credits = 0;
	selectedCoursesList.forEach((course) => {
		credits += course.credits;
	});
	setCurrCredits(credits);
	return !(credits > maxCredits || credits < minCredits);
};

export const alterFullTime = (setIsFullTime) => {
	setIsFullTime((isFullTime) => !isFullTime);
};

export const triggerModification = (setModification) => {
	setModification((modification) => !modification);
};

export const changeListVariant = (isValidList, listSent) => {
	if (!listSent) {
		return isValidList ? 'warning' : 'danger';
	} else return 'success';
};
