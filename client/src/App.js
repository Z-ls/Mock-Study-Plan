import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
	UnauthenticatedUserView,
	SelectedCoursesView
} from './components/StudyPlanViews';
import { checkAuth } from './components/models/AuthFunctions';
import './App.css';

function App() {
	const [availableCoursesList, setAvailableCoursesList] = useState([]);
	const [selectedCoursesList, setSelectedCoursesList] = useState([]);
	const [isSelectable, setIsSelectable] = useState(false);
	const [isAvailListReady, setIsAvailListReady] = useState(true);
	const [hasLoggedIn, setHasLoggedIn] = useState(false);
	const [user, setUser] = useState();
	const viewStatesAndHooks = {
		availableCoursesList,
		setAvailableCoursesList,
		selectedCoursesList,
		setSelectedCoursesList,
		hasLoggedIn,
		setHasLoggedIn,
		user,
		setUser,
		isSelectable,
		setIsSelectable,
		isAvailListReady,
		setIsAvailListReady
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
						}
					/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
