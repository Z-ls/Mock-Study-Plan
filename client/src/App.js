import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
	UnauthenticatedUserView,
	SelectedCoursesView
} from "./components/StudyPlanViews";
import { checkAuth } from "./components/models/AuthFunctions";
import "./App.css";

function App() {
	// In early versions, I had tried putting states and functions involving them in another (class) file
	// That I created a "state class", not for fancy stuff, just too many states are a little bit difficult to locate
	// Which as you can guess, led to serious re-rendering problem and the application ran like Internet Explorer(rip).
	// Alternatively I create an object containing those classes, which is supposed to be no differences from passing one-by-one
	// Because they will be all passed down after all, when any of they do change, the component will be rerendered anyway.
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
					path="/"
					element={
						<UnauthenticatedUserView
							viewStatesAndHooks={viewStatesAndHooks}
						/>
					}>
					<Route
						path="edit"
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
