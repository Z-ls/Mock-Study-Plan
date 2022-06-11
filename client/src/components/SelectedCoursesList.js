import { Row, Col, ListGroup, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
const listFunctions = require('./models/SelectedCourses');

export function SelectedCoursesList(props) {
	const [isFullTime, setIsFullTime] = useState(true);
	const [currCredits, setCurrCredits] = useState(0);
	const [isValid, setIsValid] = useState(false);
	const [hasSent, setHasSent] = useState(false);

	let minCredits = isFullTime ? 60 : 20;
	let maxCredits = isFullTime ? 80 : 40;

	useEffect(() => {
		listFunctions.fetchSelectedCourses(
			props.setSelectedCoursesList,
			props.matricola
		);
		listFunctions.triggerModification(props.setModification);
	}, [props.matricola]);

	useEffect(() => {
		const isCreditValid = listFunctions.checkCredits(
			props.selectedCoursesList,
			setCurrCredits,
			maxCredits,
			minCredits
		);
		setIsValid(isCreditValid);
	}, [setCurrCredits, maxCredits, minCredits, props.selectedCoursesList]);

	return (
		<ListGroup id='selList'>
			<ListActions
				isValid={isValid}
				setIsValid={setIsValid}
				setCurrCredits={setCurrCredits}
				setSelectedCoursesList={props.setSelectedCoursesList}
				matricola={props.matricola}
				hasSent={hasSent}
				setHasSent={setHasSent}
				setModification={props.setModification}
			/>
			<RowCredits
				hasSent={hasSent}
				isValid={isValid}
				minCredits={minCredits}
				currCredits={currCredits}
				maxCredits={maxCredits}
			/>
			<ListGroup.Item className='d-none d-xl-block'>
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
				hasSent={hasSent}
				setHasSent={setHasSent}
				setModification={props.setModification}
			/>
		</ListGroup>
	);
}

function ListActions(props) {
	return (
		<ListGroup.Item className='d-none d-xl-block'>
			<Row className='d-flex justify-content-around'>
				<Col className='d-flex justify-content-start'>
					<Button
						variant='success'
						disabled={!props.isValid}
						onClick={() => {
							listFunctions.updateSelectedCourses(
								props.matricola
							);
							listFunctions.triggerModification(
								props.setModification
							);
							props.setHasSent(true);
						}}>
						SAVE
					</Button>
				</Col>
				<Col className='d-flex justify-content-end'>
					<Button
						variant='light'
						onClick={() => {
							props.setSelectedCoursesList([]);
							props.setIsValid(false);
							props.setHasSent(false);
							listFunctions.triggerModification(
								props.setModification
							);
						}}>
						CANCEL
					</Button>
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
	return props.selectedCoursesList.map((course) => (
		<ListRow
			key={'sel_' + course.code}
			isValid={props.isValid}
			selectedCoursesList={props.selectedCoursesList}
			setSelectedCoursesList={props.setSelectedCoursesList}
			hasSent={props.hasSent}
			setHasSent={props.setHasSent}
			course={course}
			setModification={props.setModification}
		/>
	));
}

function ListRow(props) {
	return (
		<ListGroup.Item
			action
			key={props.course.code}
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
						props.selectedCoursesList,
						props.setSelectedCoursesList
					);
					props.setHasSent(false);
					listFunctions.triggerModification(props.setModification);
				}
			}}>
			<Row>
				<Col lg={1}>{props.course.code}</Col>
				<Col lg={6}>{props.course.name}</Col>
			</Row>
		</ListGroup.Item>
	);
}
