// Functional Import
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AvailableCoursesList } from "./AvailableCoursesList";
import { SelectedCoursesList } from "./SelectedCoursesList";
// Structural Import
import { Container, Row } from "react-bootstrap";
import { AuthNavBar } from "./AuthNavBar";

// I am kind of worried about the layout resembles too much of the Polito one
// you have to forgive me, after all those years
// this is what's showing up in my brain when you mention "study plan"
// and I know there is a (huge) possibility that like 50 of us making more or less the same page
// I personally blame Polito for this LOL

export function UnauthenticatedUserView(props) {
	const navigate = useNavigate();
	const pState = props.viewStatesAndHooks;

	useEffect(() => {
		if (pState.hasLoggedIn) {
			navigate("/edit", { replace: true });
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
			<Container className="d-block justify-content-center">
				<Row>
					<AvailableCoursesList
						isReady={pState.isAvailListReady}
						setIsReady={pState.setIsAvailListReady}
						isSelectable={pState.isSelectable}
						hasLoggedIn={pState.hasLoggedIn}
						availableCoursesList={pState.availableCoursesList}
						selectedCoursesList={pState.selectedCoursesList}
						setAvailableCoursesList={pState.setAvailableCoursesList}
						setSelectedCoursesList={pState.setSelectedCoursesList}
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

// In early versions there was an attempt that there was a separated route /new,
// which is a layout component of SelectedView in its <outlet/>
// However it always ended up with infinite redirects which was seriously stalling the development
// It was finally laid off, however I'd like to try it given another chance...
// No please I do not mean another exam of course XD

export function SelectedCoursesView(props) {
	const navigate = useNavigate();
	const pState = props.viewStatesAndHooks;

	useEffect(() => {
		if (!pState.hasLoggedIn) {
			navigate("/", { replace: true });
		}
	}, [pState.hasLoggedIn, navigate]);

	return (
		<Container className="d-block justify-content-center">
			{pState.hasLoggedIn && (
				<Row>
					<SelectedCoursesList
						hasLoggedIn={pState.hasLoggedIn}
						matricola={pState.user.matricola}
						availableCoursesList={pState.availableCoursesList}
						selectedCoursesList={pState.selectedCoursesList}
						setAvailableCoursesList={pState.setAvailableCoursesList}
						setSelectedCoursesList={pState.setSelectedCoursesList}
						setIsSelectable={pState.setIsSelectable}
						setIsAvailListReady={pState.setIsAvailListReady}
					/>
				</Row>
			)}
		</Container>
	);
}
