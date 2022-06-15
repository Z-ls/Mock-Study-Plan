import { Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { addSelectedCourse } from './models/SelectedCourses';
import {
	fetchAvailableCourses,
	setAvailableCoursesStatus
} from './models/AvailableCourses';

export function AvailableCoursesList(props) {
	useEffect(() => {
		fetchAvailableCourses(props.setAvailableCoursesList);
	}, [props.setAvailableCoursesList, props.hasLoggedIn]);

	useEffect(() => {
		if (props.selectedCoursesList)
			setAvailableCoursesStatus(
				props.setAvailableCoursesList,
				props.selectedCoursesList
			);
	}, [
		props.selectedCoursesList,
		props.setAvailableCoursesList,
		props.modification
	]);

	return (
		<Container fluid>
			<ListGroup.Item className='d-none d-xl-block'>
				<Row className='d-flex align-items-center justify-content-evenly'>
					<Col lg={2}>Code</Col>
					<Col lg={5}>Name</Col>
					<Col lg={1}>Credits</Col>
					<Col lg={1}>Current Students</Col>
					<Col lg={1}>Max Students</Col>
				</Row>
			</ListGroup.Item>
			<ListGroup
				style={
					props.hasLoggedIn
						? { overflow: 'auto', maxHeight: '300px' }
						: {}
				}>
				<ListContent
					hasLoggedIn={props.hasLoggedIn}
					availableCoursesList={props.availableCoursesList}
					selectedCoursesList={props.selectedCoursesList}
					setSelectedCoursesList={props.setSelectedCoursesList}
					setModification={props.setModification}
				/>
			</ListGroup>
		</Container>
	);
}

function ListContent(props) {
	return props.availableCoursesList.map(course => (
		<ListRow
			hasLoggedIn={props.hasLoggedIn}
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
					setShowStatus(showStatus => !showStatus);
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
					hasLoggedIn={props.hasLoggedIn}
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
				...transitionStyles[props.showStatus]
			}}
			onClick={() => {
				addSelectedCourse(props.course, props.setSelectedCoursesList);
			}}>
			<Row>
				<Col>
					{!props.hasLoggedIn ? (
						<div className='text-muted'>Please Login first</div>
					) : props.course.isTaken ? (
						<div className='text-muted'>Course Added</div>
					) : props.course.isFullyBooked ? (
						<div className='text-muted'>
							The course is Fully Booked...Please try later
						</div>
					) : props.addable ? (
						<div className='text'>
							Click the row to add{' '}
							<Badge>{props.course.code}</Badge>
						</div>
					) : (
						<div className='text-muted'>
							Click to Add after eliminating Constraints!
						</div>
					)}
				</Col>
				<Col className='d-flex justify-content-center'>
					<ShowConflictBadges
						course={props.course}
						selectedCoursesList={props.selectedCoursesList}
					/>
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
		<Badge bg='success'>No Incompatibles!</Badge>
	) : (
		<>
			<div className='text-muted'>Incompatible with</div>
			{props.course.incompatibleCodes.map(code => (
				<Badge
					className='ms-1'
					bg={
						props.course.conflictsList &&
						!props.course.conflictsList.includes(code)
							? 'success'
							: 'danger'
					}>
					{code}
				</Badge>
			))}
		</>
	);
}

function ShowPreparatoryBadge(props) {
	return props.course.preparatoryCourseCode ? (
		<>
			<div className='text-muted'>Needs</div>
			<Badge
				className='ms-1'
				bg={props.course.hasPreparatory ? 'success' : 'warning'}>
				{props.course.preparatoryCourseCode}
			</Badge>
		</>
	) : (
		<Badge bg='success'>No Preparatory Required!</Badge>
	);
}

const defaultStyles = {
	transition: `opacity 300ms ease-in-out`,
	opacity: 0
};

const transitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: { opacity: 0 },
	exited: { opacity: 0 }
};
