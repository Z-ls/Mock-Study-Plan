import { Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { fetchAvailableCourses } from './models/AvailableCourses';
import {
	addSelectedCourse,
	checkPreparatory,
	triggerModification,
} from './models/SelectedCourses';

export function AvailableCoursesList(props) {
	useEffect(() => {
		fetchAvailableCourses(props.setAvailableCoursesList);
	}, [props.setAvailableCoursesList]);

	return (
		<ListGroup id='availList'>
			<ListGroup.Item className='d-none d-xl-block'>
				<Row>
					<Col lg={2}>Code</Col>
					<Col lg={5}>Name</Col>
					<Col lg={1}>Credits</Col>
					<Col lg={1}>Current Students</Col>
					<Col lg={1}>Max Students</Col>
				</Row>
			</ListGroup.Item>
			<ListContent
				availableCoursesList={props.availableCoursesList}
				selectedCoursesList={props.selectedCoursesList}
				setSelectedCoursesList={props.setSelectedCoursesList}
				setModification={props.setModification}
			/>
		</ListGroup>
	);
}

function ListContent(props) {
	return props.availableCoursesList.map((course) => (
		<ListRow
			selectedCoursesList={props.selectedCoursesList}
			setSelectedCoursesList={props.setSelectedCoursesList}
			setModification={props.setModification}
			course={course}
		/>
	));
}

function ListRow(props) {
	const [showStatus, setShowStatus] = useState(false);
	const isCourseValid = !(
		props.course.isFullyBooked ||
		props.course.isTaken ||
		props.course.hasConflicts ||
		!props.course.hasPreparatory
	);

	return (
		<>
			<ListGroup.Item
				action
				eventKey={'avail_' + props.course.code}
				variant={
					isCourseValid
						? ''
						: !props.course.isTaken
						? 'danger'
						: 'success'
				}
				onClick={() => {
					setShowStatus((showStatus) => !showStatus);
				}}>
				<Row className='d-flex align-items-center justify-content-evenly'>
					<Col lg={2}>{props.course.code}</Col>
					<Col lg={5}>{props.course.name}</Col>
					<Col lg={1}>{props.course.credits}</Col>
					<Col lg={1}>{props.course.currStudents}</Col>
					<Col lg={1}>{props.course.maxStudents}</Col>
				</Row>
			</ListGroup.Item>
			{showStatus && (
				<ListRowStatus
					showStatus={showStatus}
					selectedCoursesList={props.selectedCoursesList}
					setSelectedCoursesList={props.setSelectedCoursesList}
					setModification={props.setModification}
					addable={isCourseValid}
					course={props.course}
				/>
			)}
		</>
	);
}

function ListRowStatus(props) {
	return (
		<ListGroup.Item
			action
			disabled={!props.addable}
			styles={{
				...defaultStyles,
				...transitionStyles[props.showStatus],
			}}
			onClick={() => {
				addSelectedCourse(
					props.course,
					props.selectedCoursesList,
					props.setSelectedCoursesList
				);
				triggerModification(props.setModification);
			}}>
			<Row>
				<Col>
					{props.course.isTaken && <Badge bg='info'>Chosen</Badge>}
				</Col>
				<Col className='d-flex justify-content-center'>
					<ShowConflictBadges course={props.course} />
				</Col>
				<Col className='d-flex align-content-center'>
					<ShowPreparatoryBadge
						course={props.course}
						selectedCoursesList={props.selectedCoursesList}
					/>
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

function ShowConflictBadges(props) {
	return props.course.incompatibleCodes.length === 0 ? (
		<Badge bg='success'>No Course Conflict!</Badge>
	) : (
		props.course.incompatibleCodes.map((code) => (
			<Badge
				bg={
					props.course.conflictsList.includes(props.code)
						? 'danger'
						: 'success'
				}>
				{code}
			</Badge>
		))
	);
}

function ShowPreparatoryBadge(props) {
	return props.course.hasPreparatory ? (
		<Badge bg='success'>No Preparatory Required!</Badge>
	) : (
		<Badge
			bg={
				!checkPreparatory(props.course.code, props.selectedCoursesList)
					? 'success'
					: 'warning'
			}>
			{props.course.preparatoryCourseCode}
		</Badge>
	);
}

const defaultStyles = {
	transition: `opacity 300ms ease-in-out`,
	opacity: 0,
};

const transitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: { opacity: 0 },
	exited: { opacity: 0 },
};
