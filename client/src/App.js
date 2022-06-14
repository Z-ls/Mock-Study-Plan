import { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate
} from 'react-router-dom';
import {
	UnauthenticatedUserView,
	SelectedCoursesView,
	CreateNewStudyPlanView
} from './components/Views';
import { checkAuth } from './components/models/AuthComponents';

function App() {
	const [availableCoursesList, setAvailableCoursesList] = useState([]);
	const [selectedCoursesList, setSelectedCoursesList] = useState([]);
	const [modification, setModification] = useState(false);
	const [hasLoggedIn, setHasLoggedIn] = useState(false);
	const [user, setUser] = useState();
	const viewStatesAndHooks = {
		availableCoursesList,
		setAvailableCoursesList,
		selectedCoursesList,
		setSelectedCoursesList,
		modification,
		setModification,
		hasLoggedIn,
		setHasLoggedIn,
		user,
		setUser
	};

	useEffect(() => {
		checkAuth(setUser, setHasLoggedIn);
	}, [setUser, setHasLoggedIn]);

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={
						<UnauthenticatedUserView
							viewStatesAndHooks={viewStatesAndHooks}
						/>
					}>
					<Route
						path='edit'
						element={
							<SelectedCoursesView
								viewStatesAndHooks={viewStatesAndHooks}
							/>
						}/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
