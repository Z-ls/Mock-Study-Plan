import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { addSelectedCourse } from "./models/SelectedCoursesFunctions";
import { fetchAvailableCourses } from "./models/AvailableCoursesFunctions";

export function AvailableCoursesList(props) {
	useEffect(() => {
		fetchAvailableCourses(props.setAvailableCoursesList, props.selectedCoursesList);
	}, [props.setAvailableCoursesList, props.selectedCoursesList]);

	return (
		<Container fluid>
			<ListGroup.Item className="d-none d-xl-block">
				<Row className="d-flex align-items-center justify-content-evenly">
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
						? { overflow: "auto", maxHeight: "300px" }
						: { overflow: "auto", maxHeight: "700px" }
				}>
				<ListContent
					isSelectable={props.isSelectable}
					isReady={props.isReady}
					setIsReady={props.setIsReady}
					hasLoggedIn={props.hasLoggedIn}
					availableCoursesList={props.availableCoursesList}
					selectedCoursesList={props.selectedCoursesList}
					setSelectedCoursesList={props.setSelectedCoursesList}
				/>
			</ListGroup>
		</Container>
	);
}

function ListContent(props) {
	return props.availableCoursesList.map(course => (
		<ListRow
			isReady={props.isReady}
			setIsReady={props.setIsReady}
			isSelectable={props.isSelectable}
			hasLoggedIn={props.hasLoggedIn}
			selectedCoursesList={props.selectedCoursesList}
			setSelectedCoursesList={props.setSelectedCoursesList}
			course={course}
		/>
	));
}

function ListRow(props) {
	const [showStatus, setShowStatus] = useState(false);

	const isAddable =
		!(
			props.course.isFullyBooked ||
			props.course.isTaken ||
			props.course.hasConflicts ||
			props.course.hasPreparatory === false
		) &&
		props.isSelectable &&
		props.hasLoggedIn;

	return (
		<>
			<ListGroup.Item
				action
				key={"avail-" + props.course.code}
				variant={
					// If the user has not logged in, it renders white background
					// This is for avoiding the list from becoming "all-red" on start
					isAddable || !props.hasLoggedIn
						? " "
						: props.isSelectable && props.hasLoggedIn && props.course.isTaken
						? "success"
						: "danger"
				}
				onClick={() => {
					setShowStatus(showStatus => !showStatus);
				}}>
				<Row className="d-flex align-items-center justify-content-evenly my-2">
					<Col lg={2}>{props.course.code}</Col>
					<Col lg={5}>{props.course.name}</Col>
					<Col lg={1}>{props.course.credits}</Col>
					<Col lg={1}>{props.course.currStudents}</Col>
					<Col lg={1}>{props.course.maxStudents}</Col>
				</Row>
				{showStatus && (
					<ListRowStatus
						isReady={props.isReady}
						setIsReady={props.setIsReady}
						isSelectable={props.isSelectable}
						hasLoggedIn={props.hasLoggedIn}
						showStatus={showStatus}
						selectedCoursesList={props.selectedCoursesList}
						setSelectedCoursesList={props.setSelectedCoursesList}
						isAddable={isAddable}
						course={props.course}
					/>
				)}
			</ListGroup.Item>
		</>
	);
}

// In early version, this row was another row of ListGroup.Item
// But thus it visually separated itself from the parent-row
// To emphasize the parent-child relationship, it was changed to a single row
// Shortcoming is, despite uglier in my opinion, it cannot be "disabled" as when it was a ListGroup.Item
// Now you can still click on the row, the line just folds with no change to any table, plus cursor appears different
function ListRowStatus(props) {
	return (
		<Row
			as="li"
			className={
				props.isAddable
					? "allowed-status"
					: "blocked-status " +
					  "d-flex align-items-center justify-content-between"
			}
			onClick={() => {
				if (props.isAddable)
					addSelectedCourse(props.course, props.setSelectedCoursesList);
			}}>
			<hr
				style={{
					backgroundColor: "grey",
					height: 1,
					opacity: 0.3
				}}
			/>
			<Col>
				{props.hasLoggedIn ? (
					props.isAddable ? (
						<div className="text">Click THIS Row To ADD</div>
					) : !props.isSelectable ? (
						<div className="text-muted">Create a Study Plan first</div>
					) : props.course.isTaken ? (
						<div className="text-muted">Course Added</div>
					) : props.course.isFullyBooked ? (
						<div className="text-muted">Fully booked</div>
					) : (
						<div className="text-muted">Please check the constraint</div>
					)
				) : (
					<div className="text-muted">Please login first</div>
				)}
			</Col>
			<Col className="d-flex justify-content-center">
				<ShowConflictBadges
					course={props.course}
					selectedCoursesList={props.selectedCoursesList}
				/>
			</Col>
			<Col className="d-flex align-content-center">
				<ShowPreparatoryBadge
					course={props.course}
					selectedCoursesList={props.selectedCoursesList}
				/>
			</Col>
		</Row>
	);
}

function ShowConflictBadges(props) {
	return props.course.incompatibleCodes.length === 0 ? (
		<Badge bg="success">No Incompatibles!</Badge>
	) : (
		<>
			<div className="text-muted">Incompatible with</div>
			{props.course.incompatibleCodes.map(code => (
				<Badge
					className="mx-1"
					bg={
						props.course.conflictsList &&
						props.course.conflictsList.includes(code)
							? "danger"
							: "success"
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
			<div className="text-muted">Needs</div>
			<Badge
				className="mx-1"
				bg={props.course.hasPreparatory ? "success" : "warning"}>
				{props.course.preparatoryCourseCode}
			</Badge>
		</>
	) : (
		<Badge bg="success">No Preparatory Required!</Badge>
	);
}
