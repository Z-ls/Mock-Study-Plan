import { getSelectedCourses, updateStudyPlan } from '../../API';

export const fetchSelectedCourses = async (
	setSelectedCoursesList,
	setIsFullTime,
	setIsEmpty,
	matricola
) => {
	const listObj = await getSelectedCourses(matricola);
	setIsFullTime(!!listObj.isFullTime);
	setIsEmpty(listObj.list.length === 0);
	setSelectedCoursesList(listObj.list);
};

export const updateSelectedCourses = async (
	matricola,
	isFullTime,
	selectedCoursesList
) => {
	await updateStudyPlan(matricola, isFullTime, selectedCoursesList);
};

export const addSelectedCourse = (course, setSelectedCoursesList) => {
	if (
		!(
			course.isFullyBooked ||
			course.isTaken ||
			course.hasConflicts ||
			!course.hasPreparatory
		)
	)
		setSelectedCoursesList(originalList => originalList.concat(course));
};

export const removeSelectedCourse = async (
	courseCode,
	setSelectedCoursesList
) => {
	setSelectedCoursesList(selectedCoursesList =>
		selectedCoursesList.filter(course => course.code !== courseCode)
	);
};

export const checkFullyBooked = selectedCoursesList => {
	return !selectedCoursesList.some(
		course => course.currStudents === course.maxStudents
	);
};

export const checkDuplicate = (courseCode, selectedCoursesList) => {
	return !selectedCoursesList.map(course => course.code).includes(courseCode);
};

export const checkConflicts = (courseCode, selectedCoursesList) => {
	let flag = true;
	selectedCoursesList.forEach(course => {
		if (course.incompatibleCodes.includes(courseCode)) {
			flag = false;
		}
	});
	return flag;
};

export const checkPreparatory = (courseCode, selectedCoursesList) => {
	return !selectedCoursesList
		.map(course => course.preparatoryCourseCode)
		.includes(courseCode);
};

export const findPreparatory = (courseCode, selectedCoursesList) => {
	return selectedCoursesList.find(
		course => course.preparatoryCourseCode === courseCode
	);
};

export const checkCredits = (
	selectedCoursesList,
	setCurrCredits,
	maxCredits,
	minCredits
) => {
	let credits = 0;
	selectedCoursesList.forEach(course => {
		credits += course.credits;
	});
	setCurrCredits(credits);
	return !(credits > maxCredits || credits < minCredits);
};

export const alterFullTime = setIsFullTime => {
	setIsFullTime(isFullTime => !isFullTime);
};

export const triggerModification = setModification => {
	setModification(modification => !modification);
};

export const changeListVariant = (isValidList, listSent) => {
	if (!listSent) {
		return isValidList ? 'warning' : 'danger';
	} else return 'success';
};
