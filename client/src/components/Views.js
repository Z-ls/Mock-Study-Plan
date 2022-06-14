// Functional Import
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AvailableCoursesList } from './AvailableCoursesList';
import { SelectedCoursesList } from './SelectedCoursesList';
import { fetchSelectedCourses } from './models/SelectedCourses';
// Structural Import
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AuthNavBar } from './AuthNavBar';

export function UnauthenticatedUserView(props) {
	const navigate = useNavigate();
	const pState = props.viewStatesAndHooks;

	useEffect(() => {
		if (pState.hasLoggedIn) {
			navigate('/edit', { replace: true });
		}
	}, [pState.hasLoggedIn, navigate]);

	return (
		<Container fluid>
			<AuthNavBar
				hasLoggedIn={pState.hasLoggedIn}
				setHasLoggedIn={pState.setHasLoggedIn}
				user={pState.user}
				setUser={pState.setUser}
			/>
			<br />
			<Container className='d-block justify-content-center'>
				<Row>
					<AvailableCoursesList
						hasLoggedIn={pState.hasLoggedIn}
						availableCoursesList={pState.availableCoursesList}
						selectedCoursesList={pState.selectedCoursesList}
						setAvailableCoursesList={pState.setAvailableCoursesList}
						setSelectedCoursesList={pState.setSelectedCoursesList}
						setModification={pState.setModification}
					/>
				</Row>
			</Container>
			<br />
			<Outlet />
			<br />
			<br />
			<br />
		</Container>
	);
}

export function SelectedCoursesView(props) {
	const navigate = useNavigate();
	const pState = props.viewStatesAndHooks;
	const [isEmpty, setIsEmpty] = useState(undefined);
	const [isFullTime, setIsFullTime] = useState(false);

	useEffect(() => {
		if (!pState.hasLoggedIn) {
			navigate('/', { replace: true });
		}
	}, [pState.hasLoggedIn, navigate]);

	useEffect(() => {
		if (pState.hasLoggedIn) {
			fetchSelectedCourses(
				pState.setSelectedCoursesList,
				setIsFullTime,
				setIsEmpty,
				pState.matricola
			);
		}
	}, [
		pState.hasLoggedIn,
		pState.matricola,
		pState.setSelectedCoursesList,
		setIsFullTime,
		setIsEmpty
	]);

	return (
		<Container className='d-block justify-content-center'>
			{pState.hasLoggedIn && (
				<Row>
					{isEmpty === false ? (
						<SelectedCoursesList
							isEmpty={isEmpty}
							isFullTime={isFullTime}
							hasLoggedIn={pState.hasLoggedIn}
							matricola={pState.user.matricola}
							availableCoursesList={pState.availableCoursesList}
							selectedCoursesList={pState.selectedCoursesList}
							setIsEmpty={setIsEmpty}
							setIsFullTime={setIsFullTime}
							setAvailableCoursesList={
								pState.setAvailableCoursesList
							}
							setSelectedCoursesList={
								pState.setSelectedCoursesList
							}
							setModification={pState.setModification}
						/>
					) : (
						<CreateNewStudyPlanView
							setIsEmpty={setIsEmpty}
							setIsFullTime={setIsFullTime}
						/>
					)}
				</Row>
			)}
		</Container>
	);
}

export function CreateNewStudyPlanView(props) {
	return (
		<Container fluid>
			<Container className='d-block justify-content-center'>
				<Row className='d-flex justify-content-center'>
					<Col className='d-flex justify-content-center'>
						<Button
							className='mx-2'
							variant='primary'
							onClick={() => {
								props.setIsEmpty(() => false);
								props.setIsFullTime(() => true);
							}}>
							Create a Full-Time Study Plan
						</Button>
						<Button
							className='mx-2'
							variant='primary'
							onClick={() => {
								props.setIsEmpty(() => false);
								props.setIsFullTime(() => false);
							}}>
							Create a Part-Time Study Plan
						</Button>
					</Col>
				</Row>
			</Container>
			<br />
		</Container>
	);
}
