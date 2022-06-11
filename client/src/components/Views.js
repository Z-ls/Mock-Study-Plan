// Structural Imports
import { Container, Row } from 'react-bootstrap';
import { AvailableCoursesList } from './AvailableCoursesList';
import { SelectedCoursesList } from './SelectedCoursesList';
import { AuthNavBar } from './AuthNavBar';
import { useState, useEffect } from 'react';
// Functional Imports
import { setAvailableCoursesStatus } from './models/AvailableCourses';

export function AppRoute() {
	const [availableCoursesList, setAvailableCoursesList] = useState([]);
	const [selectedCoursesList, setSelectedCoursesList] = useState([]);
	const [modification, setModification] = useState(false);
	const [hasLoggedIn, setHasLoggedIn] = useState(false);
	const [user, setUser] = useState();

	useEffect(() => {
		setAvailableCoursesStatus(
			availableCoursesList,
			setAvailableCoursesList,
			selectedCoursesList
		);
	}, [modification, selectedCoursesList.length]);

	return (
		<Container fluid>
			<AuthNavBar
				hasLoggedIn={hasLoggedIn}
				setHasLoggedIn={setHasLoggedIn}
				user={user}
				setUser={setUser}
			/>
			<Container className='d-block mt-5 justify-content-center'>
				<Row>
					<AvailableCoursesList
						availableCoursesList={availableCoursesList}
						selectedCoursesList={selectedCoursesList}
						setAvailableCoursesList={setAvailableCoursesList}
						setSelectedCoursesList={setSelectedCoursesList}
						modification={modification}
						setModification={setModification}
					/>
				</Row>
			</Container>
			<br />
			{hasLoggedIn && (
				<Container className='d-block justify-content-center'>
					<Row>
						<SelectedCoursesList
							hasLoggedIn={hasLoggedIn}
							matricola={user.matricola}
							availableCoursesList={availableCoursesList}
							selectedCoursesList={selectedCoursesList}
							setAvailableCoursesList={setAvailableCoursesList}
							setSelectedCoursesList={setSelectedCoursesList}
							modification={modification}
							setModification={setModification}
						/>
					</Row>
				</Container>
			)}
			<br />
		</Container>
	);
}
