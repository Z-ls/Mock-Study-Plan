class Course {
	constructor(
		code,
		name,
		credits,
		currStudents,
		maxStudents,
		incompatibleCodes,
		preparatoryCourseCode
	) {
		this.code = code;
		this.name = name;
		this.credits = credits;
		this.currStudents = currStudents;
		this.maxStudents = maxStudents;
		this.incompatibleCodes = [];
		if (incompatibleCodes) {
			for (let courseId of incompatibleCodes.split(' '))
				this.incompatibleCodes.push(courseId);
		}
		this.preparatoryCourseCode = preparatoryCourseCode;
	}
}

export { Course };
