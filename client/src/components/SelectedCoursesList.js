import { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Button, Badge, Modal } from 'react-bootstrap';
const listFunctions = require('./models/SelectedCourses');

export function SelectedCoursesList(props) {
	const [currCredits, setCurrCredits] = useState(0);
	const [isValid, setIsValid] = useState(false);
	const [hasSent, setHasSent] = useState(false);

	const minCredits = props.isFullTime ? 60 : 20;
	const maxCredits = props.isFullTime ? 80 : 40;

	// useEffect(() => {
	// 	if (props.hasLoggedIn) {
	// 		listFunctions.fetchSelectedCourses(
	// 			props.setSelectedCoursesList,
	// 			props.setIsFullTime,
	// 			props.setIsEmpty,
	// 			props.matricola
	// 		);
	// 	}
	// }, [
	// 	props.hasLoggedIn,
	// 	props.matricola,
	// 	props.setSelectedCoursesList,
	// 	props.setIsFullTime,
	// 	props.setIsEmpty
	// ]);

	useEffect(() => {
		setHasSent(false);
		listFunctions.triggerModification(props.setModification);
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

	return (
		<ListGroup style={props.hasLoggedIn ? { overflow: 'auto' } : {}}>
			<ListActions
				isValid={isValid}
				isFullTime={props.isFullTime}
				selectedCoursesList={props.selectedCoursesList}
				setIsValid={setIsValid}
				setIsFullTime={props.setIsFullTime}
				setCurrCredits={setCurrCredits}
				setSelectedCoursesList={props.setSelectedCoursesList}
				setIsEmpty={props.setIsEmpty}
				matricola={props.matricola}
				hasSent={hasSent}
				setHasSent={setHasSent}
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
			<ListContent
				selectedCoursesList={props.selectedCoursesList}
				setSelectedCoursesList={props.setSelectedCoursesList}
				setCurrCredits={setCurrCredits}
				minCredits={minCredits}
				maxCredits={maxCredits}
				isValid={isValid}
			/>
		</ListGroup>
	);
}

function ListActions(props) {
	const [showDialog, setShowDialog] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState(false);

	return (
		<ListGroup.Item className='d-none d-xl-block'>
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
								props.setIsEmpty,
								props.matricola
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
									undefined,
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
						onHide={() => setShowDialog(false)}
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
					Min Credits: {props.minCredits}
				</Col>
				<Col className='d-flex justify-content-center'>
					Current Credits: {props.currCredits}
				</Col>
				<Col className='d-flex justify-content-end'>
					Max Credits: {props.maxCredits}
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
