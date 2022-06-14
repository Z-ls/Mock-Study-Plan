import { useState } from 'react';
import { Container, Row, Col, Form, Navbar, Button } from 'react-bootstrap';
import { logIn, logOut } from '../API';

export function AuthNavBar(props) {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');

	return (
		<Navbar bg={props.hasLoggedIn ? 'success' : 'dark'}>
			<Container
				fluid
				className='d-flex justify-content-center'>
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
	function submitCredentials(event) {
		event.preventDefault();
		const credentials = { username: props.id, password: props.password };
		handleLogin(credentials, props.setHasLoggedIn, props.setUser);
	}

	return (
		<Row className='d-flex'>
			<Col
				lg={4}
				className='d-inline justify-content-end align-items-center'>
				<Form.Control
					value={props.id}
					placeholder='matricola'
					type='text'
					onChange={event => props.setId(event.target.value)}
					required={true}
				/>
			</Col>
			<Col
				lg={4}
				className='d-inline justify-content-end align-items-center'>
				<Form.Control
					value={props.password}
					placeholder='password'
					type='password'
					onChange={event => props.setPassword(event.target.value)}
					required={true}
					minLength={6}
				/>
			</Col>
			<Col className='d-flex justify-content-end'>
				<Button
					variant='success'
					onClick={submitCredentials}>
					LOGIN
				</Button>
			</Col>
			<Col className='d-flex justify-content-start'>
				<Button
					variant='warning'
					onClick={() => {
						props.setId('');
						props.setPassword('');
					}}>
					CLEAR
				</Button>
			</Col>
		</Row>
	);
}

function WelcomeMessage(props) {
	return (
		<Row className='d-inline justify-content-evenly'>
			<Col className='d-inline justify-content-start align-items-center'>
				Hello! {props.user.matricola} {props.user.first_name}{' '}
				{props.user.last_name} !
			</Col>
			<Col className='d-inline justify-content-end align-items-center'>
				<Button
					variant='dark'
					onClick={() => {
						handleLogout(props.setHasLoggedIn, props.setUser);
					}}>
					LOGOUT
				</Button>
			</Col>
		</Row>
	);
}

const handleLogin = async (credentials, setHasLoggedIn, setUser) => {
	try {
		const user = await logIn(credentials);
		setHasLoggedIn(true);
		setUser(user);
	} catch (err) {
		throw err;
	}
};

const handleLogout = async (setHasLoggedIn, setUser) => {
	await logOut();
	setHasLoggedIn(false);
	setUser(undefined);
};
