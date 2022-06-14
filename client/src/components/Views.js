// Functional Import
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AvailableCoursesList } from './AvailableCoursesList';
import { SelectedCoursesList } from './SelectedCoursesList';
import { fetchSelectedCourses } from './models/SelectedCourses';
import { setAvailableCoursesStatus } from './models/AvailableCourses';
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
	// const [isEmpty, setIsEmpty] = useState(undefined);
	// const [isFullTime, setIsFullTime] = useState(false);

	useEffect(() => {
		if (!pState.hasLoggedIn) {
			navigate('/', { replace: true });
		}
	}, [pState.hasLoggedIn, navigate]);

	return (
		<Container className='d-block justify-content-center'>
			{pState.hasLoggedIn && (
				<Row>
					<SelectedCoursesList
						hasLoggedIn={pState.hasLoggedIn}
						matricola={pState.user.matricola}
						availableCoursesList={pState.availableCoursesList}
						selectedCoursesList={pState.selectedCoursesList}
						setAvailableCoursesList={pState.setAvailableCoursesList}
						setSelectedCoursesList={pState.setSelectedCoursesList}
						setModification={pState.setModification}
					/>
				</Row>
			)}
		</Container>
	);
}
