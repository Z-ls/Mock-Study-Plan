import { logIn, logOut } from '../../API';

export async function handleLogin(credentials, setHasLoggedIn, setUser) {
	try {
		const user = await logIn(credentials);
		setHasLoggedIn(true);
		setUser(user);
	} catch (err) {
		throw err;
	}
}

export const handleLogout = async (setHasLoggedIn, setUser) => {
	await logOut();
	setHasLoggedIn(false);
	setUser(undefined);
};
