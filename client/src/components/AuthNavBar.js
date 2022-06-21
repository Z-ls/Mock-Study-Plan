import { useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Navbar,
	Button,
	OverlayTrigger,
	Popover
} from "react-bootstrap";
import { handleLogin, handleLogout } from "./models/AuthFunctions";

// Differs from Big Labs, I did not try to put the login form in another route
// Firstly, I personally think it is counter-intuitive,
// it makes no sense the log-in process prevents users from seeing the tables (getting information)
// Secondly, the log-in form has too little to deserve a separated page
// I low-key was really bothered that in the big lab the login form resided in a "blank-nowhere"
// But I do agree that there should be some compromises in order to show knowledge
// And I know if I do that I can show things like location states
// If you want you are welcomed to ask questions about things
// in that alternative universe where all those below was put in another route

export function AuthNavBar(props) {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");

	return (
		<Navbar bg={props.hasLoggedIn ? "success" : "dark"}>
			<Container
				fluid
				className="d-flex justify-content-center">
				{props.hasLoggedIn ? (
					<WelcomeMessage
						user={props.user}
						setHasLoggedIn={props.setHasLoggedIn}
						setUser={props.setUser}
					/>
				) : (
					<LoginForm
						id={id}
						setId={setId}
						password={password}
						setPassword={setPassword}
						setHasLoggedIn={props.setHasLoggedIn}
						setUser={props.setUser}
					/>
				)}
			</Container>
		</Navbar>
	);
}

function LoginForm(props) {
	const [errMessage, setErrMessage] = useState("");
	const [showPopup, setShowPopup] = useState(false);

	function submitCredentials(event) {
		event.preventDefault();
		const credentials = {
			username: props.id,
			password: props.password
		};
		handleLogin(credentials, props.setHasLoggedIn, props.setUser).catch(err => {
			setErrMessage(err.error ? err.error : "Missing credentials");
			setShowPopup(true);
		});
	}

	return (
		<Row className="d-flex">
			<Col
				lg={4}
				className="d-inline justify-content-end align-items-center">
				<Form.Control
					required={true}
					value={props.id}
					placeholder="matricola"
					type="text"
					onChange={event => props.setId(event.target.value)}
				/>
			</Col>
			<Col
				lg={4}
				className="d-inline justify-content-end align-items-center">
				<Form.Control
					required={true}
					minLength={6}
					value={props.password}
					placeholder="password"
					type="password"
					onChange={event => props.setPassword(event.target.value)}
				/>
			</Col>
			<Col className="d-flex justify-content-end">
				<OverlayTrigger
					trigger="click"
					show={showPopup}
					key="login-popup"
					placement="bottom"
					overlay={
						<Popover>
							<Popover.Body>{errMessage}</Popover.Body>
						</Popover>
					}>
					<Button
						variant="success"
						onClick={submitCredentials}>
						LOGIN
					</Button>
				</OverlayTrigger>
			</Col>
			<Col className="d-flex justify-content-start">
				<Button
					variant="warning"
					onClick={() => {
						props.setId("");
						props.setPassword("");
					}}>
					CLEAR
				</Button>
			</Col>
		</Row>
	);
}

function WelcomeMessage(props) {
	return (
		<Row className="d-inline justify-content-evenly">
			<Col className="d-inline justify-content-start align-items-center">
				Hello!{" "}
				<strong>
					{" "}
					{props.user.matricola} {props.user.first_name} {props.user.last_name}{" "}
					!
				</strong>
			</Col>
			<Col className="d-inline justify-content-end align-items-center">
				<Button
					variant="dark"
					onClick={() => {
						handleLogout(props.setHasLoggedIn, props.setUser);
					}}>
					LOGOUT
				</Button>
			</Col>
		</Row>
	);
}
