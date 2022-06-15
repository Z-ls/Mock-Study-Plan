import { useEffect, useState } from 'react';
import {
	Container,
	Row,
	Col,
	ListGroup,
	Button,
	Badge,
	Modal
} from 'react-bootstrap';
const listFunctions = require('./models/SelectedCourses');

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
		// listFunctions.triggerModification(props.setModification);
		const isCreditValid = listFunctions.checkCredits(
			props.selectedCoursesList,
			setCurrCredits,
			maxCredits,
			minCredits
		);
		setIsValid(isCreditValid);
	}, [
		props.setModification,
		setHasSent,
		setCurrCredits,
		maxCredits,
		minCredits,
		props.selectedCoursesList
	]);

	return isEmpty ? (
		<Container fluid>
			<CreateNewStudyPlanRow
				setIsSelectable={props.setIsSelectable}
				setIsEmpty={setIsEmpty}
				setIsFullTime={setIsFullTime}
				setModification={props.setModification}
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
					setSelectedCoursesList={props.setSelectedCoursesList}
					setIsEmpty={setIsEmpty}
					setModification={props.setModification}
				/>
				<RowCredits
					hasSent={hasSent}
					isValid={isValid}
					minCredits={minCredits}
					currCredits={currCredits}
					maxCredits={maxCredits}
				/>
				<ListGroup.Item
					className='d-none d-xl-block'
					id='selList'>
					<Row>
						<Col lg={1}>Code</Col>
						<Col lg={6}>Name</Col>
					</Row>
				</ListGroup.Item>
			</ListGroup>
			<ListGroup
				style={
					props.hasLoggedIn
						? { overflow: 'auto', maxHeight: '300px' }
						: {}
				}>
				<ListContent
					selectedCoursesList={props.selectedCoursesList}
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
		<Row className='d-flex justify-content-center'>
			<Col className='d-flex justify-content-center'>
				<Button
					className='mx-2'
					variant='primary'
					onClick={() => {
						props.setIsSelectable(true);
						props.setIsEmpty(false);
						props.setIsFullTime(true);
					}}>
					Create a Full-Time Study Plan
				</Button>
				<Button
					className='mx-2'
					variant='primary'
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
			<Row className='d-flex justify-content-around'>
				<Col className='d-flex justify-content-start'>
					<Button
						variant='success'
						disabled={!props.isValid}
						onClick={() => {
							listFunctions.updateSelectedCourses(
								props.matricola,
								props.isFullTime,
								props.selectedCoursesList
							);
							props.setHasSent(true);
						}}>
						SAVE
					</Button>
				</Col>
				<Col className='d-flex justify-content-end'>
					<Button
						className='ms-1'
						variant='light'
						onClick={() => {
							listFunctions.fetchSelectedCourses(
								props.setSelectedCoursesList,
								props.setIsFullTime,
								props.setIsSelectable,
								props.setIsEmpty,
								props.matricola
							);
							props.setModification(
								modification => !modification
							);
							props.setHasSent(false);
						}}>
						CANCEL
					</Button>
					<Button
						className='ms-1'
						variant='warning'
						onClick={() => {
							props.setSelectedCoursesList([]);
							props.setHasSent(false);
							props.setIsValid(false);
						}}>
						CLEAR
					</Button>
					<Button
						className='ms-1'
						variant='danger'
						onClick={() => {
							if (deleteConfirm) {
								props.setSelectedCoursesList([]);
								props.setIsValid(false);
								listFunctions.updateSelectedCourses(
									props.matricola,
									props.isFullTime,
									props.selectedCoursesList
								);
							} else setShowDialog(true);
							setDeleteConfirm(false);
							props.setHasSent(true);
						}}>
						DELETE
					</Button>
					<Modal
						show={showDialog}
						onHide={() => setShowDialog(() => false)}
						size='lg'
						backdrop='static'
						centered>
						<Modal.Header closeButton>
							<Modal.Title>
								This operation is irreversible!
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Row className='text-danger d-flex justify-content-center'>
								This operation will delete the current study
								plan from both the client AND the server.
							</Row>
							<Row className='text-danger d-flex justify-content-center'>
								Are you sure about this?
							</Row>
							<Row className='text d-flex justify-content-center'>
								After confirmation, you can click the delete
								button again to take effect the deletion.
							</Row>
						</Modal.Body>
						<Modal.Footer>
							<Button
								variant='success'
								onClick={() => {
									setDeleteConfirm(true);
									setShowDialog(false);
								}}>
								I know what I am doing
							</Button>
							<Button
								variant='light'
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
			variant={listFunctions.changeListVariant(
				props.isValid,
				props.hasSent
			)}>
			<Row>
				<Col className='d-flex justify-content-start'>
					Min Credits:{' '}
					{props.minCredits
						? props.minCredits
						: ' Please choose a Study Plan'}
				</Col>
				<Col className='d-flex justify-content-center'>
					Current Credits:{' '}
					{props.currCredits
						? props.currCredits
						: ' Please choose a Study Plan'}
				</Col>
				<Col className='d-flex justify-content-end'>
					Max Credits:{' '}
					{props.maxCredits
						? props.maxCredits
						: ' Please choose a Study Plan'}
				</Col>
			</Row>
		</ListGroup.Item>
	);
}

function ListContent(props) {
	return props.selectedCoursesList.map(course => (
		<ListRow
			key={'sel_' + course.code}
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
				<Col lg={1}>{props.course.code}</Col>
				<Col lg={6}>{props.course.name}</Col>
				{!hasPreparatory && (
					<Col lv={2}>
						<Badge bg='warning'>
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
