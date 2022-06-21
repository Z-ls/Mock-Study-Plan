import { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button, Badge, Modal } from "react-bootstrap";
const listFunctions = require("./models/SelectedCoursesFunctions");

export function SelectedCoursesList(props) {
	const [isEmpty, setIsEmpty] = useState(true);
	const [isFullTime, setIsFullTime] = useState(undefined);
	const [currCredits, setCurrCredits] = useState(0);
	const [isValid, setIsValid] = useState(false);
	const [hasSent, setHasSent] = useState(false);
	const [minCredits, setMinCredits] = useState(isFullTime);
	const [maxCredits, setMaxCredits] = useState(isFullTime);

	useEffect(() => {
		setMinCredits(isFullTime ? 60 : 20);
		setMaxCredits(isFullTime ? 80 : 40);
	}, [isFullTime]);

	useEffect(() => {
		if (props.hasLoggedIn) {
			listFunctions.fetchSelectedCourses(
				props.setSelectedCoursesList,
				setIsFullTime,
				props.setIsSelectable,
				setIsEmpty,
				props.matricola
			);
		} else {
			props.setIsSelectable(false);
		}
	}, [
		props.hasLoggedIn,
		props.matricola,
		props.setSelectedCoursesList,
		props.setIsSelectable,
		setIsFullTime,
		setIsEmpty
	]);

	useEffect(() => {
		setHasSent(false);
		const isCreditValid = listFunctions.checkCredits(
			props.selectedCoursesList,
			setCurrCredits,
			maxCredits,
			minCredits
		);
		setIsValid(isCreditValid);
	}, [setHasSent, setCurrCredits, maxCredits, minCredits, props.selectedCoursesList]);

	return isEmpty ? (
		<Container fluid>
			<CreateNewStudyPlanRow
				setIsSelectable={props.setIsSelectable}
				setIsEmpty={setIsEmpty}
				setIsFullTime={setIsFullTime}
			/>
		</Container>
	) : (
		<Container fluid>
			<ListGroup>
				<ListActions
					isValid={isValid}
					isFullTime={isFullTime}
					matricola={props.matricola}
					hasSent={hasSent}
					selectedCoursesList={props.selectedCoursesList}
					setHasSent={setHasSent}
					setIsValid={setIsValid}
					setIsFullTime={setIsFullTime}
					setIsSelectable={props.setIsSelectable}
					setCurrCredits={setCurrCredits}
					setAvailableCoursesList={props.setAvailableCoursesList}
					setSelectedCoursesList={props.setSelectedCoursesList}
					setIsAvailListReady={props.setIsAvailListReady}
					setIsEmpty={setIsEmpty}
				/>
				<RowCredits
					hasSent={hasSent}
					isValid={isValid}
					minCredits={minCredits}
					currCredits={currCredits}
					maxCredits={maxCredits}
				/>
				<ListGroup.Item className="d-none d-xl-block">
					<Row>
						<Col lg={1}>Code</Col>
						<Col lg={6}>Name</Col>
					</Row>
				</ListGroup.Item>
			</ListGroup>
			<ListGroup style={{ overflow: "auto", maxHeight: "300px" }}>
				<ListContent
					selectedCoursesList={props.selectedCoursesList}
					setAvailableCoursesList={props.setAvailableCoursesList}
					setSelectedCoursesList={props.setSelectedCoursesList}
					setCurrCredits={setCurrCredits}
					minCredits={minCredits}
					maxCredits={maxCredits}
					isValid={isValid}
				/>
			</ListGroup>
		</Container>
	);
}

export function CreateNewStudyPlanRow(props) {
	return (
		<Row className="d-flex justify-content-center">
			<Col className="d-flex justify-content-evenly">
				<Button
					className="mx-2"
					variant="primary"
					onClick={() => {
						props.setIsSelectable(true);
						props.setIsEmpty(false);
						props.setIsFullTime(true);
					}}>
					Create a Full-Time Study Plan
				</Button>
				<Button
					className="mx-2"
					variant="primary"
					onClick={() => {
						props.setIsSelectable(true);
						props.setIsEmpty(false);
						props.setIsFullTime(false);
					}}>
					Create a Part-Time Study Plan
				</Button>
			</Col>
		</Row>
	);
}

function ListActions(props) {
	const [showDialog, setShowDialog] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState(false);

	return (
		<ListGroup.Item>
			<Row className="d-flex justify-content-around">
				<Col className="d-flex justify-content-start">
					<Button
						variant="success"
						disabled={!props.isValid}
						onClick={() => {
							listFunctions.updateSelectedCourses(
								props.matricola,
								props.isFullTime,
								props.selectedCoursesList
							);
							props.setHasSent(true);
						}}>
						SAVE THIS STUDY PLAN
					</Button>
				</Col>
				<Col className="d-flex justify-content-end">
					<Button
						className="mx-1"
						variant="light"
						onClick={() => {
							listFunctions.fetchSelectedCourses(
								props.setSelectedCoursesList,
								props.setIsFullTime,
								props.setIsSelectable,
								props.setIsEmpty,
								props.matricola
							);
						}}>
						CANCEL
					</Button>
					<Button
						className="mx-1"
						variant="warning"
						onClick={() => {
							props.setSelectedCoursesList([]);
							props.setHasSent(false);
							props.setIsValid(false);
						}}>
						CLEAR
					</Button>
					<Button
						className="mx-1"
						variant="danger"
						onClick={() => {
							if (deleteConfirm) {
								props.setSelectedCoursesList([]);
								props.setIsEmpty(true);
								props.setIsSelectable(false);
								listFunctions.deleteCurrentStudyPlan(props.matricola);
								// Motivation: why fetch here?
								// This fetching could be seen as a "synchronization" between server and client,
								// in case of inconsistent values between them, as the "deleting" operation is of great importance
								// But instant fetching could lead to getting outdated information so there is a timeout
								// As this fetching is not blocking any operation, maybe we can call it being "pseudo-asynchronous"
								setTimeout(
									() =>
										listFunctions.fetchSelectedCourses(
											props.setSelectedCoursesList,
											props.setIsFullTime,
											props.setIsSelectable,
											props.setIsEmpty,
											props.matricola
										),
									500
								);
							} else setShowDialog(true);
							setDeleteConfirm(false);
							props.setHasSent(true);
						}}>
						{!deleteConfirm ? "DELETE" : "CONFIRM DELETE"}
					</Button>

					{/* Sorry if this looks messy, 
						the modal originally resided outside this file, but it triggers constant rerendering and not showing up,
						I do not have a solution to resolve that issue, so I just put it here.
						Aside from all this piece of code I really think it's worth the space, the confirmation is really important imo. */}
					<Modal
						show={showDialog}
						onHide={() => setShowDialog(() => false)}
						size="lg"
						backdrop="static"
						centered>
						<Modal.Header closeButton>
							<Modal.Title>This operation is irreversible!</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Row className="text-danger d-flex justify-content-center">
								This operation will delete the current study plan from
								both the client AND the server
							</Row>
							<Row className="text-danger d-flex justify-content-center">
								Are you sure about this?
							</Row>
							<Row className="text d-flex justify-content-center">
								After confirmation, you can click the delete button again
								to take effect the deletion.
							</Row>
						</Modal.Body>
						<Modal.Footer>
							<Button
								variant="success"
								onClick={() => {
									setDeleteConfirm(true);
									setShowDialog(false);
								}}>
								I know what I am doing
							</Button>
							<Button
								variant="light"
								onClick={() => setShowDialog(false)}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

function RowCredits(props) {
	return (
		<ListGroup.Item
			variant={listFunctions.changeListVariant(props.isValid, props.hasSent)}>
			<Row>
				<Col className="d-flex justify-content-start">
					Min Credits: {props.minCredits}
				</Col>
				<Col className="d-flex justify-content-center">
					Current Credits: {props.currCredits}
				</Col>
				<Col className="d-flex justify-content-end">
					Max Credits: {props.maxCredits}
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

function ListContent(props) {
	return props.selectedCoursesList.map(course => (
		<ListRow
			isValid={props.isValid}
			selectedCoursesList={props.selectedCoursesList}
			setSelectedCoursesList={props.setSelectedCoursesList}
			hasSent={props.hasSent}
			course={course}
		/>
	));
}

function ListRow(props) {
	const hasPreparatory = listFunctions.checkPreparatory(
		props.course.code,
		props.selectedCoursesList
	);
	return (
		<ListGroup.Item
			action
			key={props.course.code}
			disabled={!hasPreparatory}
			variant={() => {
				listFunctions.changeListVariant(props.isValid, props.hasSent);
			}}
			onClick={() => {
				if (
					listFunctions.checkPreparatory(
						props.course.code,
						props.selectedCoursesList
					)
				) {
					listFunctions.removeSelectedCourse(
						props.course.code,
						props.setSelectedCoursesList
					);
				}
			}}>
			<Row>
				<Col lg={2}>{props.course.code}</Col>
				<Col lg={5}>{props.course.name}</Col>
				{!hasPreparatory && (
					<Col lv={2}>
						<Badge bg="warning">
							Required By <></>
							{
								listFunctions.findPreparatory(
									props.course.code,
									props.selectedCoursesList
								).code
							}
						</Badge>
					</Col>
				)}
			</Row>
		</ListGroup.Item>
	);
}
